/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { setTimeout as delay } from "node:timers/promises";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import type { GetNftCollectionItemsRequest } from "@/repositories/api/token/request";
import type { GetNftCollectionItemsResponse } from "@/repositories/api/token/response";
import { useNftInventoryControls } from "./use-nft-inventory-controls";

const mockRepository = { getNftCollectionItems: jest.fn() };
jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiTokenRepository: mockRepository }),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "test-chain" } }),
}));

const COLLECTION = "gno.land/r/example/nfts.NFT.0000000";
const allItems = Array.from({ length: 70 }, (_, index) => ({
  tokenId: COLLECTION,
  packagePath: "gno.land/r/example/nfts",
  nftId: String(index + 1),
  ownerAddress: `owner-${index + 1}`,
  operatorAddress: "",
}));
function collectionPage({
  tokenKey,
  limit = 20,
  page = 1,
}: GetNftCollectionItemsRequest): GetNftCollectionItemsResponse {
  return {
    items: allItems.slice((page - 1) * limit, page * limit).map(item => ({ ...item, tokenId: tokenKey })),
    page: { totalCount: allItems.length, hasNext: page * limit < allItems.length },
  };
}

// TS 4.9 and the supported older Node runtimes do not expose Promise.withResolvers.
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

const cleanups: (() => void)[] = [];
function createView() {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, cacheTime: Infinity } },
  });
  const container = document.createElement("div");
  const root = createRoot(container);
  function Inventory({ selected, limit, collection }: { selected: string | null; limit: number; collection: string }) {
    const view = useNftInventoryControls(collection, limit, selected);
    const item = view.loadedItems.find(item => item.nftId === selected);
    return (
      <section>
        <output data-page>{view.page}</output>
        <output data-owner>{item?.ownerAddress ?? "-"}</output>
        <output data-previous>{view.previousNftId ?? "-"}</output>
        <output data-next>{view.nextNftId ?? "-"}</output>
        <button onClick={() => view.toolbarProps.onSearchChange("28")}>Search</button>
        <button onClick={() => view.onChangePage(view.page + 1)}>Next page</button>
        <button onClick={() => view.onSelectItem("28")}>Select token 28</button>
        <button onClick={view.toolbarProps.onSortToggle}>Toggle sort</button>
        <button onClick={() => view.nextNftId && view.onSelectItem(view.nextNftId)}>Next token</button>
        <button onClick={() => view.previousNftId && view.onSelectItem(view.previousNftId)}>Previous token</button>
        <button onClick={() => view.toolbarProps.onSearchChange("r/gnoswap/pool")}>Search realm label</button>
        <output data-suggestions>{view.toolbarProps.ownerSuggestions.map(owner => owner.label).join("|")}</output>
        {view.error ? (
          <p role="alert">{view.error.message}</p>
        ) : view.isResolving ? (
          <p>Loading</p>
        ) : (
          view.items.map(item => (
            <article key={item.nftId} data-selected={item.nftId === selected}>
              {item.nftId}
            </article>
          ))
        )}
      </section>
    );
  }
  cleanups.push(() => {
    act(() => root.unmount());
    client.clear();
  });
  return {
    client,
    container,
    render(selected: string | null, limit = 22, collection = COLLECTION) {
      act(() =>
        root.render(
          <QueryClientProvider client={client}>
            <Inventory selected={selected} limit={limit} collection={collection} />
          </QueryClientProvider>,
        ),
      );
    },
    value(selector: string) {
      return container.querySelector(selector)?.textContent;
    },
    click(index: number) {
      act(() => container.querySelectorAll("button")[index].click());
    },
  };
}
async function settleUntil(condition: () => boolean) {
  for (let attempt = 0; attempt < 50; attempt++) {
    await act(async () => {
      await delay(0);
      await delay(0);
    });
    if (condition()) return;
  }
  throw new Error("Inventory did not reach the expected state");
}
beforeEach(() => {
  mockRepository.getNftCollectionItems.mockReset().mockImplementation(async params => collectionPage(params));
});
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
});

it("resumes remaining pages and search results after a failed next page is successfully refetched", async () => {
  const view = createView();
  let failing = true;
  mockRepository.getNftCollectionItems.mockImplementation(async params => {
    if (failing && params.page === 2) throw new Error("Temporary outage");
    return collectionPage(params);
  });
  view.render(null, 20);
  await settleUntil(() => view.container.querySelectorAll("article").length === 20);
  view.click(0);
  await settleUntil(() => !!view.container.querySelector('[role="alert"]'));
  failing = false;
  await act(async () => {
    await view.client.refetchQueries(["test-chain", QUERY_KEY.getNftCollectionItems, "all"]);
  });
  await settleUntil(() => view.container.querySelector("article")?.textContent === "28");
  expect(view.container.querySelector('[role="alert"]')).toBeNull();
  expect(view.container.querySelectorAll("article")).toHaveLength(1);
});

it("finds NFTs by the displayed realm path of their owner and suggests the matching owner", async () => {
  const view = createView();
  mockRepository.getNftCollectionItems.mockImplementation(async params => {
    const page = collectionPage(params);
    return {
      ...page,
      items: page.items.map(item =>
        item.nftId === "5" || item.nftId === "6"
          ? { ...item, ownerAddress: "g1pool", ownerLabel: "gno.land/r/gnoswap/pool", ownerLabelType: "REALM" }
          : item,
      ),
    } as GetNftCollectionItemsResponse;
  });
  view.render(null, 20);
  await settleUntil(() => view.container.querySelectorAll("article").length === 20);
  view.click(6);
  await settleUntil(() => view.container.querySelectorAll("article").length === 2);
  expect(view.value("[data-suggestions]")).toBe("r/gnoswap/pool");
});

it("finds an off-page linked NFT, restores its owner and neighbors, and stops the lookup at the matching page", async () => {
  const view = createView();
  view.render("28");
  await settleUntil(() => view.value("[data-page]") === "2" && view.value("[data-previous]") === "27");
  expect(view.value("[data-owner]")).toBe("owner-28");
  expect(view.value("[data-next]")).toBe("29");
  expect(view.container.querySelector('article[data-selected="true"]')?.textContent).toBe("28");
  expect(
    mockRepository.getNftCollectionItems.mock.calls.some(([params]) => params.limit === 20 && params.page > 2),
  ).toBe(false);
  view.click(1);
  await settleUntil(
    () => view.value("[data-page]") === "3" && view.container.querySelector("article")?.textContent === "45",
  );
  expect(view.value("[data-owner]")).toBe("owner-28");
});

it("does not scan the collection for a linked NFT already on the visible page", async () => {
  const view = createView();
  view.render("12");
  await settleUntil(() => view.value("[data-owner]") === "owner-12");
  expect(view.value("[data-page]")).toBe("1");
  expect(view.value("[data-previous]")).toBe("11");
  expect(view.value("[data-next]")).toBe("13");
  expect(mockRepository.getNftCollectionItems.mock.calls.some(([params]) => params.limit === 20)).toBe(false);
});

it("does not resolve a superseded linked NFT when an earlier lookup completes", async () => {
  const view = createView();
  const pending = deferred<GetNftCollectionItemsResponse>();
  mockRepository.getNftCollectionItems.mockImplementation(async params =>
    params.limit === 20 && params.page === 2 ? pending.promise : collectionPage(params),
  );
  view.render("28");
  await settleUntil(() =>
    mockRepository.getNftCollectionItems.mock.calls.some(([params]) => params.limit === 20 && params.page === 2),
  );
  view.render("12");
  await act(async () => {
    pending.resolve(collectionPage({ tokenKey: COLLECTION, limit: 20, page: 2 }));
  });
  await settleUntil(() => view.value("[data-owner]") === "owner-12");
  expect(view.value("[data-page]")).toBe("1");
  expect(view.value("[data-previous]")).toBe("11");
  expect(view.value("[data-next]")).toBe("13");
});

it("finishes an absent linked NFT without selecting a different row or repeatedly scanning", async () => {
  const view = createView();
  view.render("missing");
  await settleUntil(
    () =>
      mockRepository.getNftCollectionItems.mock.calls.some(([params]) => params.limit === 20 && params.page === 4) &&
      view.container.querySelectorAll("article").length === 22,
  );
  expect(view.value("[data-page]")).toBe("1");
  expect(view.value("[data-owner]")).toBe("-");
  expect(view.value("[data-previous]")).toBe("-");
  expect(view.value("[data-next]")).toBe("-");
  view.render("missing");
  await act(async () => {
    await delay(0);
    await delay(0);
  });
  expect(
    mockRepository.getNftCollectionItems.mock.calls.filter(([params]) => params.limit === 20 && params.page === 4),
  ).toHaveLength(1);
});

it("keeps a clicked NFT on its anchored page during the 20/22 resize without scanning", async () => {
  const view = createView();
  const pending = deferred<GetNftCollectionItemsResponse>();
  mockRepository.getNftCollectionItems.mockImplementation(async params =>
    params.limit === 22 && params.page === 2 ? pending.promise : collectionPage(params),
  );
  view.render(null, 20);
  await settleUntil(() => view.container.querySelector("article")?.textContent === "1");
  view.click(1);
  await settleUntil(() => view.container.querySelector("article")?.textContent === "21");
  view.click(2);
  view.render("28", 22);
  expect(view.value("[data-page]")).toBe("2");
  expect(view.value("[data-owner]")).toBe("owner-28");
  expect(view.container.querySelectorAll("article")).toHaveLength(20);
  await act(async () => {
    pending.resolve(collectionPage({ tokenKey: COLLECTION, limit: 22, page: 2 }));
  });
  await settleUntil(() => view.container.querySelector("article")?.textContent === "23");
  expect(view.value("[data-previous]")).toBe("27");
  expect(view.value("[data-next]")).toBe("29");
  expect(
    mockRepository.getNftCollectionItems.mock.calls.filter(([params]) => params.limit === 20 && params.page === 1),
  ).toHaveLength(1);
});

it("resumes a failed linked-token lookup after refetch rather than leaving its owner unresolved", async () => {
  const view = createView();
  let failing = true;
  mockRepository.getNftCollectionItems.mockImplementation(async params => {
    if (failing && params.limit === 20 && params.page === 2) throw new Error("Temporary outage");
    return collectionPage(params);
  });
  view.render("28");
  await settleUntil(() => !!view.container.querySelector('[role="alert"]'));
  failing = false;
  await act(async () => {
    await view.client.refetchQueries(["test-chain", QUERY_KEY.getNftCollectionItems, "all"]);
  });
  await settleUntil(() => view.value("[data-page]") === "2" && view.value("[data-next]") === "29");
  expect(view.value("[data-owner]")).toBe("owner-28");
  expect(view.container.querySelector('[role="alert"]')).toBeNull();
});

it("sorts the full collection from page one while a selected NFT remains open off-page", async () => {
  const view = createView();
  view.render("28", 20);
  await settleUntil(() => view.value("[data-page]") === "2" && view.value("[data-next]") === "29");

  view.click(3);
  await settleUntil(() => view.container.querySelector("article")?.textContent === "1");
  expect(view.value("[data-page]")).toBe("1");
  expect(Array.from(view.container.querySelectorAll("article"), item => item.textContent)).toEqual(
    Array.from({ length: 20 }, (_, index) => String(index + 1)),
  );
  expect(view.value("[data-owner]")).toBe("owner-28");
  expect(view.value("[data-previous]")).toBe("27");
  expect(view.value("[data-next]")).toBe("29");
  expect(view.container.querySelector('article[data-selected="true"]')).toBeNull();

  view.click(1);
  await settleUntil(() => view.container.querySelector("article")?.textContent === "21");
  view.click(3);
  await settleUntil(() => view.container.querySelector("article")?.textContent === "70");
  expect(view.value("[data-page]")).toBe("1");
  expect(Array.from(view.container.querySelectorAll("article"), item => item.textContent)).toEqual(
    Array.from({ length: 20 }, (_, index) => String(70 - index)),
  );
  expect(view.value("[data-owner]")).toBe("owner-28");
  expect(view.value("[data-previous]")).toBe("29");
  expect(view.value("[data-next]")).toBe("27");
});

it("moves across display pages in both sorted directions and stops only at result boundaries", async () => {
  const ascending = createView();
  ascending.render("20", 20);
  await settleUntil(() => ascending.value("[data-owner]") === "owner-20");
  ascending.click(3);
  await settleUntil(() => ascending.value("[data-next]") === "21");
  expect(ascending.value("[data-page]")).toBe("1");
  ascending.click(4);
  ascending.render("21", 20);
  await settleUntil(() => ascending.container.querySelector('article[data-selected="true"]')?.textContent === "21");
  expect(ascending.value("[data-page]")).toBe("2");
  expect(ascending.value("[data-previous]")).toBe("20");
  ascending.click(5);
  ascending.render("20", 20);
  expect(ascending.value("[data-page]")).toBe("1");
  ascending.render("1", 20);
  expect(ascending.value("[data-previous]")).toBe("-");
  expect(ascending.value("[data-next]")).toBe("2");
  ascending.render("70", 20);
  expect(ascending.value("[data-previous]")).toBe("69");
  expect(ascending.value("[data-next]")).toBe("-");

  const descending = createView();
  descending.render("51", 20);
  await settleUntil(() => descending.value("[data-owner]") === "owner-51");
  descending.click(3);
  await settleUntil(() => descending.value("[data-next]") === "52");
  descending.click(3);
  await settleUntil(() => descending.value("[data-next]") === "50");
  expect(descending.value("[data-page]")).toBe("1");
  descending.click(4);
  descending.render("50", 20);
  expect(descending.value("[data-page]")).toBe("2");
  expect(descending.container.querySelector('article[data-selected="true"]')?.textContent).toBe("50");
  expect(descending.value("[data-previous]")).toBe("51");
  descending.click(5);
  descending.render("51", 20);
  expect(descending.value("[data-page]")).toBe("1");
  descending.render("70", 20);
  expect(descending.value("[data-previous]")).toBe("-");
  expect(descending.value("[data-next]")).toBe("69");
  descending.render("1", 20);
  expect(descending.value("[data-previous]")).toBe("2");
  expect(descending.value("[data-next]")).toBe("-");
});
