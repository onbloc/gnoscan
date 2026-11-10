/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { setTimeout as delay } from "node:timers/promises";
import { AxiosError, AxiosResponse } from "axios";

import { QUERY_KEY as META_QUERY_KEY } from "@/common/react-query/meta/types";
import { QUERY_KEY } from "@/common/react-query/query-keys";
import { GetTokenMetaByPathResponse } from "@/repositories/api/token/response";
import { Amount, TokenResourceMeta } from "@/types/data-type";
import { useGetTokenMetaByPath } from "@/common/react-query/token/api/use-get-token-meta-by-path";
import { CsvTokenAmounts, useCsvTokenAmounts } from "./use-csv-token-amounts";

const mockRepository = { getTokenMetaByPath: jest.fn() };
const mockEnvironment = React.createContext({ chainId: "chain-a" });
jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiTokenRepository: mockRepository, blockRepository: {} }),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: jest.requireActual("react").useContext(mockEnvironment) }),
}));
jest.mock("@/common/hooks/common/use-token-meta", () => ({
  GNOTToken: { symbol: "GNOT", denom: "ugnot", decimals: 6 },
}));

const FACTORY = "gno.land/r/demo/defi/grc20factory";
const WUGNOT = "gno.land/r/gnoland/wugnot";
const GNFT = "gno.land/r/gnoswap/gnft.GNFT.0000000";
const originalFetch = globalThis.fetch;
const cleanups: (() => void)[] = [];
let current: CsvTokenAmounts;

function resource(denom: string, symbol: string, decimals: number, tokenPath?: string): TokenResourceMeta {
  return {
    id: denom,
    pkg_path: denom,
    token_path: tokenPath,
    name: symbol,
    symbol,
    decimals,
    chain_id: "chain-a",
    description: "",
    website_url: "",
    image: "",
  };
}

function backend(symbol: string, decimals: number): GetTokenMetaByPathResponse {
  return {
    data: {
      tokenType: "GRC20",
      tokenId: "1",
      slug: symbol,
      path: FACTORY,
      name: symbol,
      symbol,
      decimals,
      logoUrl: null,
      realmAddress: "",
      hostedTokenCount: 1,
    },
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => (resolve = done));
  return { promise, resolve };
}

function Probe({ amounts, sharedDenom }: { amounts: Amount[]; sharedDenom?: string }) {
  const result = useCsvTokenAmounts(amounts);
  React.useEffect(() => {
    current = result;
  }, [result]);
  useGetTokenMetaByPath(sharedDenom || "");
  return null;
}

function mount(amounts: Amount[], resources: TokenResourceMeta[] | null = [], sharedDenom?: string) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: Infinity } },
  });
  if (resources) client.setQueryData([META_QUERY_KEY.getTokenMeta, "chain-a"], resources);
  const root = createRoot(document.createElement("div"));
  const update = (nextAmounts = amounts, chainId = "chain-a") =>
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <mockEnvironment.Provider value={{ chainId }}>
            <Probe amounts={nextAmounts} sharedDenom={sharedDenom} />
          </mockEnvironment.Provider>
        </QueryClientProvider>,
      ),
    );
  update();
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

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  mockRepository.getTokenMetaByPath.mockReset();
});
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
  globalThis.fetch = originalFetch;
});

it("uses native conversion and static resource precedence without additional backend requests", async () => {
  const native = { value: "332000000", denom: "ugnot" };
  const token = { value: "9007199254740993123456", denom: `${FACTORY}.PERUN.0000001` };
  const { client, update } = mount([native, token], [resource(FACTORY, "PERUN", 3, `${FACTORY}.PERUN`)]);
  client.setQueryData(["chain-a", QUERY_KEY.getTokenMetaByPath, token.denom], backend("WRONG", 9));
  update();
  await settle();

  expect(current.isSettled).toBe(true);
  expect(current.resolveAmount(native)).toEqual({ value: "332", denom: "GNOT" });
  expect(current.resolveAmount(token)).toEqual({ value: "9007199254740993123.456", denom: "PERUN" });
  expect(mockRepository.getTokenMetaByPath).not.toHaveBeenCalled();
  const resolver = current.resolveAmount;
  update();
  expect(current.resolveAmount).toBe(resolver);
});

it("waits for delayed resources before resolving precedence or requesting missing metadata", async () => {
  const pending = deferred<Response>();
  globalThis.fetch = jest.fn(url =>
    String(url).includes("/grc20/")
      ? pending.promise
      : Promise.resolve({ ok: true, json: async () => [] } as unknown as Response),
  );
  const amount = { value: "1234567", denom: `${FACTORY}.PERUN` };
  mount([amount], null);
  await settle();
  expect(current.isSettled).toBe(false);
  expect(mockRepository.getTokenMetaByPath).not.toHaveBeenCalled();

  pending.resolve({
    ok: true,
    json: async () => [resource(FACTORY, "PERUN", 6, `${FACTORY}.PERUN`)],
  } as unknown as Response);
  await settle();
  expect(current.isSettled).toBe(true);
  expect(current.resolveAmount(amount)).toEqual({ value: "1.234567", denom: "PERUN" });
  expect(mockRepository.getTokenMetaByPath).not.toHaveBeenCalled();
});

it("waits for each distinct backend token and shares full-denom cache keys with screen queries", async () => {
  const pending = deferred<GetTokenMetaByPathResponse>();
  const resourceAmount = { value: "1500", denom: `${FACTORY}.PERUN.0000001` };
  const first = { value: "2500000", denom: `${FACTORY}.SECOND.0000002` };
  const second = { value: "375", denom: `${FACTORY}.THIRD.0000003` };
  mockRepository.getTokenMetaByPath.mockImplementation((denom: string) =>
    denom === first.denom ? pending.promise : Promise.resolve(backend("THIRD", 2)),
  );
  const { client } = mount(
    [resourceAmount, first, { ...first, value: "3000000" }, second],
    [resource(FACTORY, "PERUN", 3, `${FACTORY}.PERUN`)],
    first.denom,
  );
  await settle();
  expect(current.isSettled).toBe(false);
  expect(mockRepository.getTokenMetaByPath.mock.calls.map(([denom]) => denom).sort()).toEqual(
    [first.denom, second.denom].sort(),
  );

  pending.resolve(backend("SECOND", 6));
  await settle();
  expect(current.isSettled).toBe(true);
  expect(current.resolveAmount(resourceAmount)).toEqual({ value: "1.5", denom: "PERUN" });
  expect(current.resolveAmount(first)).toEqual({ value: "2.5", denom: "SECOND" });
  expect(current.resolveAmount(second)).toEqual({ value: "3.75", denom: "THIRD" });
  expect(client.getQueryData(["chain-a", QUERY_KEY.getTokenMetaByPath, first.denom])).toEqual(backend("SECOND", 6));
  expect(client.getQueryData(["chain-a", QUERY_KEY.getTokenMetaByPath, second.denom])).toEqual(backend("THIRD", 2));
});

it.each(["resource", "backend", "fallback"])(
  "applies the shared wugnot decimal override to %s metadata",
  async source => {
    const amount = { value: "5000000", denom: WUGNOT };
    mockRepository.getTokenMetaByPath.mockResolvedValue(source === "fallback" ? { data: {} } : backend("wugnot", 0));
    mount([amount], source === "resource" ? [resource(WUGNOT, "wugnot", 0)] : []);
    await settle();

    expect(current.isSettled).toBe(true);
    expect(current.resolveAmount(amount)).toEqual({ value: "5", denom: source === "fallback" ? WUGNOT : "wugnot" });
    expect(mockRepository.getTokenMetaByPath).toHaveBeenCalledTimes(source === "resource" ? 0 : 1);
  },
);

it("settles unknown-token failures with the screen's raw-path and GNFT fallbacks", async () => {
  const unknown = { value: "9876543210987654321", denom: `${FACTORY}.UNKNOWN.0000004` };
  const gnft = { value: "1", denom: GNFT };
  mockRepository.getTokenMetaByPath.mockRejectedValue(
    new AxiosError("Not found", undefined, undefined, undefined, { status: 404 } as AxiosResponse),
  );
  mount([unknown, gnft]);
  await settle();

  expect(current.isSettled).toBe(true);
  expect(current.resolveAmount(unknown)).toEqual({ value: unknown.value, denom: `${FACTORY}.UNKNOWN` });
  expect(current.resolveAmount(gnft)).toEqual({ value: "1", denom: "GNFT" });
  expect(mockRepository.getTokenMetaByPath).toHaveBeenCalledTimes(2);
});

it("uses backend fallback after a resource failure and ignores backend responses without decimals", async () => {
  globalThis.fetch = jest.fn().mockRejectedValue(new Error("Resource unavailable"));
  const known = { value: "1230000", denom: `${FACTORY}.KNOWN` };
  const unknown = { value: "456", denom: `${FACTORY}.UNKNOWN` };
  mockRepository.getTokenMetaByPath.mockImplementation((denom: string) =>
    Promise.resolve(denom === known.denom ? backend("KNOWN", 6) : { data: { symbol: "Ignored" } }),
  );
  mount([known, unknown], null);
  await settle();
  await settle();

  expect(current.isSettled).toBe(true);
  expect(current.resolveAmount(known)).toEqual({ value: "1.23", denom: "KNOWN" });
  expect(current.resolveAmount(unknown)).toEqual({ value: "456", denom: FACTORY });
});

it("isolates token and resource metadata by network while preserving cached results on return", async () => {
  const amount = { value: "1230000", denom: `${FACTORY}.TOKEN` };
  mockRepository.getTokenMetaByPath.mockResolvedValue(backend("FIRST", 6));
  const { client, update } = mount([amount]);
  await settle();
  expect(current.resolveAmount(amount)).toEqual({ value: "1.23", denom: "FIRST" });

  client.setQueryData([META_QUERY_KEY.getTokenMeta, "chain-b"], []);
  const pending = deferred<GetTokenMetaByPathResponse>();
  mockRepository.getTokenMetaByPath.mockReturnValue(pending.promise);
  update([amount], "chain-b");
  expect(current.isSettled).toBe(false);
  pending.resolve(backend("SECOND", 3));
  await settle();
  expect(current.resolveAmount(amount)).toEqual({ value: "1230", denom: "SECOND" });
  expect(current.isSettled).toBe(true);

  update([amount], "chain-a");
  await settle();
  expect(current.resolveAmount(amount)).toEqual({ value: "1.23", denom: "FIRST" });
  expect(mockRepository.getTokenMetaByPath).toHaveBeenCalledTimes(2);
});

it("settles native-only and empty exports without waiting for resource metadata", async () => {
  globalThis.fetch = jest.fn(() => new Promise<Response>(() => undefined));
  const native = { value: "5000000", denom: "ugnot" };
  const { update } = mount([native], null);
  expect(current.isSettled).toBe(true);
  expect(current.resolveAmount(native)).toEqual({ value: "5", denom: "GNOT" });
  update([]);
  expect(current.isSettled).toBe(true);
  expect(mockRepository.getTokenMetaByPath).not.toHaveBeenCalled();
});
