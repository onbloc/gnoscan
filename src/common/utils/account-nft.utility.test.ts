import { AccountNftPage, fetchAccountNftPage } from "./account-nft.utility";
import { GetAccountGRC721CollectionItemsResponse } from "@/repositories/api/account/response";

// Serves each collection's NFT ids in cursor pages, like the account items API.
const makeCollectionApi = (collections: Record<string, string[]>) => {
  const calls: { tokenId: string; cursor?: string; limit: number }[] = [];
  const fetchItems = async (
    tokenId: string,
    cursor: string | undefined,
    limit: number,
  ): Promise<GetAccountGRC721CollectionItemsResponse> => {
    calls.push({ tokenId, cursor, limit });
    const ids = collections[tokenId];
    const start = cursor ? Number(cursor) : 0;
    const end = Math.min(start + limit, ids.length);
    const hasNext = end < ids.length;
    return {
      items: ids.slice(start, end).map(nftId => ({
        tokenId,
        packagePath: tokenId,
        nftId,
        name: tokenId,
        symbol: tokenId,
        ownerAddress: "g1owner",
        operatorAddress: "",
        isOwned: true,
      })),
      page: { hasNext, cursor: hasNext ? String(end) : undefined },
    };
  };
  return { calls, fetchItems };
};

const pageIds = (page: AccountNftPage) => page.items.map(item => `${item.tokenId}#${item.nftId}`);

it("fills a page from the next collection when the current one runs out", async () => {
  const { fetchItems } = makeCollectionApi({ a: ["1", "2", "3"], b: ["4", "5", "6"] });

  const first = await fetchAccountNftPage(["a", "b"], undefined, 4, fetchItems);
  expect(pageIds(first)).toEqual(["a#1", "a#2", "a#3", "b#4"]);
  expect(first.page.hasNext).toBe(true);

  const second = await fetchAccountNftPage(["a", "b"], first.page.cursor, 4, fetchItems);
  expect(pageIds(second)).toEqual(["b#5", "b#6"]);
  expect(second.page).toEqual({ hasNext: false, cursor: undefined });
});

it("resumes inside a collection with that collection's cursor and only asks for the remaining slots", async () => {
  const { calls, fetchItems } = makeCollectionApi({ a: ["1", "2", "3", "4", "5"], b: ["6"] });

  const first = await fetchAccountNftPage(["a", "b"], undefined, 2, fetchItems);
  const second = await fetchAccountNftPage(["a", "b"], first.page.cursor, 2, fetchItems);
  expect(pageIds(second)).toEqual(["a#3", "a#4"]);

  const third = await fetchAccountNftPage(["a", "b"], second.page.cursor, 2, fetchItems);
  expect(pageIds(third)).toEqual(["a#5", "b#6"]);
  expect(third.page.hasNext).toBe(false);
  expect(calls.slice(-2)).toEqual([
    { tokenId: "a", cursor: "4", limit: 2 },
    { tokenId: "b", cursor: undefined, limit: 1 },
  ]);
});

it("keeps a next page when a collection ends exactly at the page boundary and more collections remain", async () => {
  const { fetchItems } = makeCollectionApi({ a: ["1", "2"], b: ["3"] });

  const first = await fetchAccountNftPage(["a", "b"], undefined, 2, fetchItems);
  expect(pageIds(first)).toEqual(["a#1", "a#2"]);
  expect(first.page.hasNext).toBe(true);

  const second = await fetchAccountNftPage(["a", "b"], first.page.cursor, 2, fetchItems);
  expect(pageIds(second)).toEqual(["b#3"]);
  expect(second.page.hasNext).toBe(false);
});
