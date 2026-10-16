/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from "react-query";
import { setTimeout as delay } from "node:timers/promises";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import type { GetNftTokenUrisResponse, NftTokenUriModel } from "@/repositories/api/token/response";
import { useNftArtwork } from "./use-nft-artwork";

const mockRepository = { getNftTokenUris: jest.fn() };
const mockNodeClient = { abciQuery: jest.fn(), abciQueryVMQueryFuncs: jest.fn() };
const mockRequestNftTokenUri = jest.fn();
let mockNetwork = { chainId: "chain-a", rpcUrl: "https://rpc-a.example", apiUrl: "https://api-a.example" };

jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiTokenRepository: mockRepository }),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: mockNetwork, nodeRPCClient: mockNodeClient }),
}));
jest.mock("@/common/clients/node-client/nft-artwork", () => ({
  requestNftTokenUri: (...args: unknown[]) => mockRequestNftTokenUri(...args),
}));

const PATH = "gno.land/r/example/nfts";
interface Token {
  packagePath: string;
  nftId: string;
}
interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: Error) => void;
}

// TS 4.9 and supported Node versions do not expose Promise.withResolvers.
function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function tokens(count: number, packagePath = PATH): Token[] {
  return Array.from({ length: count }, (_, index) => ({ packagePath, nftId: String(index + 1) }));
}

function entry(tokenId: string, overrides: Partial<NftTokenUriModel> = {}): NftTokenUriModel {
  return { tokenId, uri: "", status: "unavailable", needsRefetch: true, ...overrides };
}

function apiKey(nfts: readonly Token[], chainId = mockNetwork.chainId) {
  const groups = new Map<string, string[]>();
  for (const nft of nfts) {
    const ids = groups.get(nft.packagePath) ?? [];
    if (!ids.includes(nft.nftId)) ids.push(nft.nftId);
    groups.set(nft.packagePath, ids);
  }
  return [
    chainId,
    QUERY_KEY.getNftTokenUris,
    Array.from(groups, ([packagePath, tokenIds]) => ({ packagePath, tokenIds })),
  ];
}

function seedApi(client: QueryClient, nfts: readonly Token[], entries?: NftTokenUriModel[]) {
  client.setQueryData(
    apiKey(nfts),
    (entries ?? nfts.map(nft => entry(nft.nftId))).map(item => ({ ...item, packagePath: nfts[0].packagePath })),
  );
}

function rpcKey(tokenId: string, packagePath = PATH) {
  return [mockNetwork.chainId, QUERY_KEY.getNftTokenUriRpc, mockNetwork.rpcUrl, packagePath, tokenId];
}

const cleanups: (() => void)[] = [];
function createView() {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, cacheTime: Infinity } },
  });
  const container = document.createElement("div");
  const root = createRoot(container);
  function Artwork({ nfts }: { nfts: readonly Token[] }) {
    const image = useNftArtwork(nfts);
    return (
      <section>
        {nfts.map(nft => {
          const { src, isLoading } = image(nft.packagePath, nft.nftId);
          return (
            <article
              key={`${nft.packagePath}:${nft.nftId}`}
              data-path={nft.packagePath}
              data-token={nft.nftId}
              data-loading={isLoading}
            >
              {/* A plain image exposes the hook's resolved source without Next.js image-loader behavior. */}
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={`NFT ${nft.nftId}`} src={src} />
              ) : (
                <span>{isLoading ? "Loading artwork" : "Default artwork"}</span>
              )}
            </article>
          );
        })}
      </section>
    );
  }
  cleanups.push(() => {
    act(() => root.unmount());
    client.clear();
  });
  return {
    client,
    render(nfts: readonly Token[]) {
      act(() => {
        root.render(
          <QueryClientProvider client={client}>
            <Artwork nfts={nfts} />
          </QueryClientProvider>,
        );
      });
    },
    artwork(tokenId: string, packagePath = PATH) {
      const card = Array.from(container.querySelectorAll("article")).find(
        element => element.getAttribute("data-token") === tokenId && element.getAttribute("data-path") === packagePath,
      );
      if (!card) throw new Error(`Missing visible NFT ${packagePath}:${tokenId}`);
      return card.querySelector("img")?.getAttribute("src") ?? card.textContent;
    },
    image(tokenId: string) {
      return container.querySelector(`article[data-token="${tokenId}"] img`);
    },
    loading(tokenId: string) {
      return container.querySelector(`article[data-token="${tokenId}"]`)?.getAttribute("data-loading") === "true";
    },
  };
}

async function settle(update?: () => void) {
  await act(async () => {
    update?.();
    await delay(0);
    // React Query batches observer notifications after the request's promise settles.
    await delay(0);
  });
}

beforeEach(() => {
  mockNetwork = { chainId: "chain-a", rpcUrl: "https://rpc-a.example", apiUrl: "https://api-a.example" };
  mockRepository.getNftTokenUris.mockReset().mockResolvedValue({ items: [] });
  mockRequestNftTokenUri.mockReset();
});

afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
  focusManager.setFocused(undefined);
  onlineManager.setOnline(true);
});

it("completes only flagged visible entries and keeps fresh API artwork authoritative over RPC cache", async () => {
  const view = createView();
  const nfts = tokens(3);
  const pending = deferred<NftTokenUriModel>();
  mockRequestNftTokenUri.mockReturnValue(pending.promise);
  seedApi(view.client, nfts, [
    entry("1"),
    entry("2", { uri: "https://images.example/api-2.png", status: "found", needsRefetch: false }),
    entry("3", { status: "not_set", needsRefetch: false }),
    entry("99"),
  ]);
  for (const tokenId of ["2", "3"]) {
    view.client.setQueryData(
      rpcKey(tokenId),
      entry(tokenId, { uri: `https://images.example/rpc-${tokenId}.png`, status: "found", needsRefetch: false }),
    );
  }
  view.render(nfts);
  expect(mockRequestNftTokenUri.mock.calls.map(call => call[2])).toEqual(["1"]);
  expect(view.artwork("1")).toBe("Loading artwork");
  expect(view.artwork("2")).toBe("https://images.example/api-2.png");
  expect(view.artwork("3")).toBe("Default artwork");

  await settle(() => pending.resolve(entry("1", { image: "ipfs://first.png", status: "found", needsRefetch: false })));
  expect(view.artwork("1")).toBe("https://ipfs.io/ipfs/first.png");
  expect(view.artwork("2")).toBe("https://images.example/api-2.png");
  expect(view.artwork("3")).toBe("Default artwork");
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(1);
  expect(mockRepository.getNftTokenUris).not.toHaveBeenCalled();
  expect(view.client.getQueryData<NftTokenUriModel[]>(apiKey(nfts))?.[0].needsRefetch).toBe(true);
});

it("batches only round-trippable IDs and resolves exact unsafe IDs alongside ordinary RPC fallback", async () => {
  const view = createView();
  const safeIds = ["safe-id_1", "safe:id/2?x=y", "fallback"];
  const unsafeIds = ["comma,id", " leading", "trailing ", "amp&ersand", "plus+sign"];
  const nfts = [...safeIds, ...unsafeIds].map(nftId => ({ packagePath: PATH, nftId }));
  const backend = deferred<GetNftTokenUrisResponse>();
  const requests = new Map<string, Deferred<NftTokenUriModel>>();
  mockRepository.getNftTokenUris.mockReturnValue(backend.promise);
  mockRequestNftTokenUri.mockImplementation((_node, _path, tokenId: string) => {
    const request = deferred<NftTokenUriModel>();
    requests.set(tokenId, request);
    return request.promise;
  });

  view.render(nfts);
  expect(mockRepository.getNftTokenUris.mock.calls).toEqual([[PATH, safeIds]]);
  for (const tokenId of [...safeIds, ...unsafeIds]) {
    expect(view.artwork(tokenId)).toBe("Loading artwork");
  }
  await settle(() =>
    backend.resolve({
      items: safeIds.map(tokenId =>
        entry(
          tokenId,
          tokenId === "fallback"
            ? {}
            : { uri: "https://images.example/backend.png", status: "found", needsRefetch: false },
        ),
      ),
    }),
  );
  expect(mockRequestNftTokenUri.mock.calls).toEqual(
    ["fallback", ...unsafeIds].map(tokenId => [mockNodeClient, PATH, tokenId]),
  );
  expect(view.artwork(safeIds[0])).toBe("https://images.example/backend.png");
  expect(view.artwork(safeIds[1])).toBe("https://images.example/backend.png");
  for (const tokenId of ["fallback", ...unsafeIds]) {
    expect(view.loading(tokenId)).toBe(true);
  }

  await settle(() => {
    for (const [tokenId, request] of requests) {
      request.resolve(entry(tokenId, { uri: "https://images.example/rpc.png", status: "found", needsRefetch: false }));
    }
  });
  for (const tokenId of ["fallback", ...unsafeIds]) {
    expect(view.artwork(tokenId)).toBe("https://images.example/rpc.png");
    expect(view.loading(tokenId)).toBe(false);
  }
  expect(mockRepository.getNftTokenUris.mock.calls).toEqual([[PATH, safeIds]]);
});

it.each(["found", "not_set", "unavailable", "failed"] as const)(
  "resolves unsafe-only IDs without backend calls and finishes loading when RPC is %s",
  async outcome => {
    const view = createView();
    const unsafeIds = ["comma,id", " leading", "trailing ", "amp&ersand", "hash#tag", "plus+sign", "percent%2F"];
    const nfts = unsafeIds.map(nftId => ({ packagePath: PATH, nftId }));
    const requests = new Map<string, Deferred<NftTokenUriModel>>();
    mockRequestNftTokenUri.mockImplementation((_node, _path, tokenId: string) => {
      const request = deferred<NftTokenUriModel>();
      requests.set(tokenId, request);
      return request.promise;
    });

    view.render(nfts);
    for (const tokenId of unsafeIds) {
      expect(view.artwork(tokenId)).toBe("Loading artwork");
    }
    await settle();
    expect(mockRepository.getNftTokenUris).not.toHaveBeenCalled();
    expect(mockRequestNftTokenUri.mock.calls).toEqual(unsafeIds.map(tokenId => [mockNodeClient, PATH, tokenId]));
    for (const tokenId of unsafeIds) {
      expect(view.loading(tokenId)).toBe(true);
    }

    await settle(() => {
      for (const [tokenId, request] of requests) {
        if (outcome === "failed") request.reject(new Error("RPC unavailable"));
        else {
          request.resolve(
            entry(tokenId, {
              status: outcome,
              uri: outcome === "found" ? "https://images.example/direct.png" : "",
              needsRefetch: outcome === "unavailable",
            }),
          );
        }
      }
    });
    for (const tokenId of unsafeIds) {
      expect(view.artwork(tokenId)).toBe(outcome === "found" ? "https://images.example/direct.png" : "Default artwork");
      expect(view.loading(tokenId)).toBe(false);
    }
    view.render([...nfts]);
    await settle();
    expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(unsafeIds.length);
    expect(mockRepository.getNftTokenUris).not.toHaveBeenCalled();
  },
);

it("publishes each image without waiting for peers and isolates failures within an eight-worker pool", async () => {
  const view = createView();
  const nfts = tokens(10);
  const requests = new Map<string, Deferred<NftTokenUriModel>>();
  mockRequestNftTokenUri.mockImplementation((_node, _path, tokenId: string) => {
    const request = deferred<NftTokenUriModel>();
    requests.set(tokenId, request);
    return request.promise;
  });
  seedApi(
    view.client,
    nfts,
    nfts.map(nft =>
      entry(nft.nftId, nft.nftId === "3" ? { status: "found", uri: "https://images.example/api-3.png" } : {}),
    ),
  );
  view.render(nfts);
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(8);
  expect(view.artwork("3")).toBe("https://images.example/api-3.png");
  expect(view.loading("3")).toBe(false);
  expect(view.artwork("9")).toBe("Loading artwork");
  expect(view.artwork("10")).toBe("Loading artwork");

  await settle(() =>
    requests.get("2")!.resolve(
      entry("2", {
        uri: "https://images.example/fast.png",
        status: "found",
        needsRefetch: false,
      }),
    ),
  );
  expect(view.artwork("2")).toBe("https://images.example/fast.png");
  expect(view.artwork("1")).toBe("Loading artwork");
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(9);

  await settle(() => requests.get("3")!.reject(new Error("RPC timeout")));
  expect(view.artwork("3")).toBe("https://images.example/api-3.png");
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(10);
  await settle(() =>
    requests.get("10")!.resolve(
      entry("10", {
        uri: "https://images.example/ten.png",
        status: "found",
        needsRefetch: false,
      }),
    ),
  );
  expect(view.artwork("10")).toBe("https://images.example/ten.png");
  expect(view.artwork("1")).toBe("Loading artwork");
});

it("deduplicates in-flight IDs across 20/22 batches, preserves images during placeholders, and reuses successes", async () => {
  const view = createView();
  const initial = tokens(20);
  const expanded = tokens(22);
  const batch = deferred<GetNftTokenUrisResponse>();
  const requests = new Map<string, Deferred<NftTokenUriModel>>();
  mockRepository.getNftTokenUris.mockReturnValue(batch.promise);
  mockRequestNftTokenUri.mockImplementation((_node, _path, tokenId: string) => {
    const request = deferred<NftTokenUriModel>();
    requests.set(tokenId, request);
    return request.promise;
  });
  seedApi(view.client, initial);
  view.render(initial);
  for (const tokenId of ["1", "2"]) {
    await settle(() =>
      requests.get(tokenId)!.resolve(
        entry(tokenId, {
          uri: `https://images.example/${tokenId}.png`,
          status: "found",
          needsRefetch: false,
        }),
      ),
    );
  }
  const originalImage = view.image("1");
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(10);
  view.render(expanded);
  expect(view.artwork("1")).toBe("https://images.example/1.png");
  expect(view.image("1")).toBe(originalImage);
  expect(view.loading("1")).toBe(false);
  expect(view.artwork("22")).toBe("Loading artwork");
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(10);

  await settle(() => batch.resolve({ items: expanded.map(nft => entry(nft.nftId)) }));
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(10);
  for (let id = 3; id <= 22; id++) {
    const tokenId = String(id);
    expect(requests.has(tokenId)).toBe(true);
    await settle(() =>
      requests.get(tokenId)!.resolve(
        entry(tokenId, {
          uri: `https://images.example/${tokenId}.png`,
          status: "found",
          needsRefetch: false,
        }),
      ),
    );
  }
  view.render(initial);
  view.render(expanded);
  await settle();
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(22);
  expect(new Set(mockRequestNftTokenUri.mock.calls.map(call => call[2])).size).toBe(22);
  expect(view.artwork("22")).toBe("https://images.example/22.png");
  expect(view.image("1")).toBe(originalImage);
  expect(mockRepository.getNftTokenUris.mock.calls).toEqual([[PATH, expanded.map(nft => nft.nftId)]]);
});

it.each(["network", "endpoint", "collection"])(
  "does not apply stale %s completions to the current screen or schedule old queued tokens",
  async change => {
    const view = createView();
    // Endpoint switches deliberately reuse the same API data reference and visible IDs.
    const old = tokens(change === "endpoint" ? 1 : 10);
    const oldRequests = Math.min(8, old.length);
    const requests: Deferred<NftTokenUriModel>[] = [];
    mockRequestNftTokenUri.mockImplementation(() => {
      const request = deferred<NftTokenUriModel>();
      requests.push(request);
      return request.promise;
    });
    seedApi(view.client, old);
    view.render(old);
    expect(requests).toHaveLength(oldRequests);

    if (change === "network") mockNetwork = { ...mockNetwork, chainId: "chain-b" };
    if (change === "endpoint") mockNetwork = { ...mockNetwork, rpcUrl: "https://rpc-b.example" };
    const currentPath = change === "collection" ? "gno.land/r/other/nfts" : PATH;
    const current = tokens(1, currentPath);
    seedApi(view.client, current);
    view.render(current);
    expect(requests).toHaveLength(oldRequests + 1);
    await settle(() => {
      requests.slice(0, oldRequests).forEach((request, index) => {
        request.resolve(
          entry(String(index + 1), {
            uri: "https://images.example/old-scope.png",
            status: "found",
            needsRefetch: false,
          }),
        );
      });
    });
    expect(view.artwork("1", currentPath)).toBe("Loading artwork");
    expect(requests).toHaveLength(oldRequests + 1);
    await settle(() =>
      requests[oldRequests].resolve(
        entry("1", {
          uri: "https://images.example/current.png",
          status: "found",
          needsRefetch: false,
        }),
      ),
    );
    expect(view.artwork("1", currentPath)).toBe("https://images.example/current.png");
    expect(requests).toHaveLength(oldRequests + 1);
  },
);

it("retains an expired successful RPC image through failure, retries only on new API data, and clears it on true not_set", async () => {
  const view = createView();
  const nfts = tokens(1);
  const failed = deferred<NftTokenUriModel>();
  const fresh = deferred<NftTokenUriModel>();
  mockRequestNftTokenUri.mockReturnValueOnce(failed.promise).mockReturnValueOnce(fresh.promise);
  seedApi(view.client, nfts);
  view.client.setQueryData(
    rpcKey("1"),
    entry("1", { uri: "https://images.example/previous.png", status: "found", needsRefetch: false }),
    { updatedAt: Date.now() - 61_000 },
  );
  view.render(nfts);
  expect(view.artwork("1")).toBe("https://images.example/previous.png");
  expect(view.loading("1")).toBe(false);
  await settle(() => failed.resolve(entry("1")));
  expect(view.artwork("1")).toBe("https://images.example/previous.png");
  expect(view.loading("1")).toBe(false);
  await settle(() => {
    focusManager.setFocused(false);
    focusManager.setFocused(true);
    onlineManager.setOnline(false);
    onlineManager.setOnline(true);
  });
  view.render([...nfts]);
  await settle();
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(1);

  await settle(() =>
    seedApi(view.client, nfts, [entry("1", { uri: "https://images.example/stale-api.png", status: "found" })]),
  );
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(2);
  expect(view.artwork("1")).toBe("https://images.example/previous.png");
  await settle(() => fresh.resolve(entry("1", { status: "not_set", needsRefetch: false })));
  expect(view.artwork("1")).toBe("Default artwork");
  view.render([...nfts]);
  await settle();
  expect(view.artwork("1")).toBe("Default artwork");
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(2);
});

it("retries a transient RPC failure after an equivalent successful API refetch", async () => {
  const view = createView();
  const nfts = tokens(1);
  mockRequestNftTokenUri
    .mockResolvedValueOnce(entry("1"))
    .mockResolvedValueOnce(
      entry("1", { uri: "https://images.example/recovered.png", status: "found", needsRefetch: false }),
    );
  seedApi(view.client, nfts);
  view.render(nfts);
  await settle();
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(1);
  expect(view.artwork("1")).toBe("Default artwork");

  // Structural sharing keeps the same array for equivalent data, but the fetch itself succeeded again.
  await settle(() => seedApi(view.client, nfts));
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(2);
  expect(view.artwork("1")).toBe("https://images.example/recovered.png");
});

it.each(["unsupported", "found"] as const)("treats complete %s without an image as authoritative", async status => {
  const view = createView();
  const nfts = tokens(1);
  const request = deferred<NftTokenUriModel>();
  mockRequestNftTokenUri.mockReturnValue(request.promise);
  seedApi(view.client, nfts, [entry("1", { status: "found", uri: "https://images.example/stale.png" })]);
  view.render(nfts);
  expect(view.artwork("1")).toBe("https://images.example/stale.png");
  await settle(() => request.resolve(entry("1", { status, needsRefetch: false })));
  expect(view.artwork("1")).toBe("Default artwork");
});

it("keeps a fresh backend update authoritative when an older in-flight RPC later completes", async () => {
  const view = createView();
  const nfts = tokens(1);
  const request = deferred<NftTokenUriModel>();
  mockRequestNftTokenUri.mockReturnValue(request.promise);
  seedApi(view.client, nfts);
  view.render(nfts);
  await settle(() =>
    seedApi(view.client, nfts, [
      entry("1", { status: "found", uri: "https://images.example/fresh-api.png", needsRefetch: false }),
    ]),
  );
  expect(view.artwork("1")).toBe("https://images.example/fresh-api.png");
  await settle(() =>
    request.resolve(
      entry("1", {
        status: "found",
        uri: "https://images.example/older-rpc.png",
        needsRefetch: false,
      }),
    ),
  );
  expect(view.artwork("1")).toBe("https://images.example/fresh-api.png");
  expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(1);
});

it.each(["unavailable", "failed"] as const)(
  "keeps loading through backend and RPC resolution, then stops after RPC is %s",
  async outcome => {
    const view = createView();
    const nfts = tokens(1);
    const backend = deferred<GetNftTokenUrisResponse>();
    const rpc = deferred<NftTokenUriModel>();
    mockRepository.getNftTokenUris.mockReturnValue(backend.promise);
    mockRequestNftTokenUri.mockReturnValue(rpc.promise);

    view.render(nfts);
    expect(view.artwork("1")).toBe("Loading artwork");
    expect(mockRequestNftTokenUri).not.toHaveBeenCalled();
    await settle(() => backend.resolve({ items: [entry("1")] }));
    expect(view.artwork("1")).toBe("Loading artwork");
    expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(1);
    await settle(() => {
      if (outcome === "failed") rpc.reject(new Error("RPC unavailable"));
      else rpc.resolve(entry("1"));
    });
    expect(view.artwork("1")).toBe("Default artwork");
    expect(view.loading("1")).toBe(false);
    view.render([...nfts]);
    await settle();
    expect(view.loading("1")).toBe(false);
    expect(mockRequestNftTokenUri).toHaveBeenCalledTimes(1);
  },
);

it.each(["missing", "not_set", "unsupported"] as const)(
  "stops loading when the backend settles with %s artwork and no RPC work",
  async status => {
    const view = createView();
    const nfts = tokens(1);
    const backend = deferred<GetNftTokenUrisResponse>();
    mockRepository.getNftTokenUris.mockReturnValue(backend.promise);
    view.render(nfts);
    expect(view.artwork("1")).toBe("Loading artwork");
    await settle(() =>
      backend.resolve({
        items: status === "missing" ? [] : [entry("1", { status, needsRefetch: false })],
      }),
    );
    expect(view.artwork("1")).toBe("Default artwork");
    expect(view.loading("1")).toBe(false);
    expect(mockRequestNftTokenUri).not.toHaveBeenCalled();
  },
);

it("stops loading after reusing a completed no-art RPC result without fetching it again", async () => {
  const view = createView();
  const nfts = tokens(1);
  seedApi(view.client, nfts);
  view.client.setQueryData(rpcKey("1"), entry("1", { status: "not_set", needsRefetch: false }));
  view.render(nfts);
  await settle();
  expect(view.artwork("1")).toBe("Default artwork");
  expect(view.loading("1")).toBe(false);
  expect(mockRequestNftTokenUri).not.toHaveBeenCalled();
});

it("preserves cached backend artwork without loading while its batch refreshes", async () => {
  const view = createView();
  const nfts = tokens(1);
  const backend = deferred<GetNftTokenUrisResponse>();
  mockRepository.getNftTokenUris.mockReturnValue(backend.promise);
  seedApi(view.client, nfts, [
    entry("1", { status: "found", uri: "https://images.example/cached.png", needsRefetch: false }),
  ]);
  view.render(nfts);
  const originalImage = view.image("1");
  await settle(() => {
    void view.client.invalidateQueries(apiKey(nfts));
  });
  expect(mockRepository.getNftTokenUris).toHaveBeenCalledTimes(1);
  expect(view.artwork("1")).toBe("https://images.example/cached.png");
  expect(view.image("1")).toBe(originalImage);
  expect(view.loading("1")).toBe(false);
  await settle(() =>
    backend.resolve({
      items: [entry("1", { status: "found", uri: "https://images.example/refreshed.png", needsRefetch: false })],
    }),
  );
  expect(view.artwork("1")).toBe("https://images.example/refreshed.png");
  expect(view.loading("1")).toBe(false);
});
