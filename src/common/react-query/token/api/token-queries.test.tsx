/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { setTimeout as delay } from "node:timers/promises";

import type { GetNftTokenDetailResponse } from "@/repositories/api/token/response";
import { useGetNftTokenDetail } from "./use-get-nft-collection";
import { useGetTokenMetaByPath } from "./use-get-token-meta-by-path";

const mockRepository = { getTokenMetaByPath: jest.fn(), getNftTokenDetail: jest.fn() };
jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiTokenRepository: mockRepository }),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "test-chain" } }),
}));

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const PACKAGE = "gno.land/r/example/nfts";
const cleanups: (() => void)[] = [];

function mount(render: () => React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, cacheTime: Infinity } },
  });
  const root = createRoot(document.createElement("div"));
  const update = (element: React.ReactElement) =>
    act(() => root.render(<QueryClientProvider client={client}>{element}</QueryClientProvider>));
  update(render());
  cleanups.push(() => {
    act(() => root.unmount());
    client.clear();
  });
  return { client, update };
}

async function settle() {
  await act(async () => {
    await delay(0);
    await delay(0);
  });
}

function detail(overrides: Partial<GetNftTokenDetailResponse> = {}): GetNftTokenDetailResponse {
  return {
    tokenId: "1",
    uri: "",
    status: "found",
    metadataStatus: "found",
    uriNeedsRefetch: false,
    metadataNeedsRefetch: false,
    ...overrides,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

beforeEach(() => {
  mockRepository.getTokenMetaByPath.mockReset();
  mockRepository.getNftTokenDetail.mockReset();
});
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
});

describe("useGetTokenMetaByPath", () => {
  function Probe({ enabled }: { enabled: boolean }) {
    useGetTokenMetaByPath("gno.land/r/demo/foo", { enabled });
    return null;
  }

  it("does not request token meta when the caller disables the query", async () => {
    mount(() => <Probe enabled={false} />);
    await settle();
    expect(mockRepository.getTokenMetaByPath).not.toHaveBeenCalled();
  });

  it("requests token meta when the caller enables the query", async () => {
    mockRepository.getTokenMetaByPath.mockResolvedValue({ data: {} });
    mount(() => <Probe enabled={true} />);
    await settle();
    expect(mockRepository.getTokenMetaByPath).toHaveBeenCalledTimes(1);
  });
});

describe("useGetNftTokenDetail", () => {
  function Probe({ nftId, onDetail }: { nftId: string; onDetail: (data?: GetNftTokenDetailResponse) => void }) {
    onDetail(useGetNftTokenDetail(PACKAGE, nftId).data);
    return null;
  }

  it("keeps a metadata refresh recoverable when the user leaves the token before it completes", async () => {
    const refresh = deferred<GetNftTokenDetailResponse>();
    mockRepository.getNftTokenDetail.mockImplementation(
      async (_path: string, nftId: string, forceRefresh?: boolean) => {
        if (forceRefresh) return refresh.promise;
        return nftId === "A"
          ? detail({ tokenId: "A", metadataStatus: "unavailable", metadataNeedsRefetch: true })
          : detail();
      },
    );
    let shown: GetNftTokenDetailResponse | undefined;
    const view = mount(() => <Probe nftId="A" onDetail={data => (shown = data)} />);
    await settle();
    expect(mockRepository.getNftTokenDetail).toHaveBeenCalledWith(PACKAGE, "A", true);

    // Switch to B while A's forced refresh is still in flight, then let that refresh succeed.
    view.update(<Probe nftId="B" onDetail={data => (shown = data)} />);
    await settle();
    refresh.resolve(detail({ tokenId: "A", metadata: { name: "Refreshed A" } }));
    await settle();

    view.update(<Probe nftId="A" onDetail={data => (shown = data)} />);
    await settle();
    expect(shown?.metadataNeedsRefetch).toBe(false);
    expect(shown?.metadata?.name).toBe("Refreshed A");
  });
});
