import { AccountNftPage, fetchAccountNftPage } from "./account-nft.utility";
import { GetAccountGRC721CollectionItemsResponse } from "@/repositories/api/account/response";

const makeCollectionApi = (data: Record<string, string[]>) => {
  const calls: { tokenId: string; page: number; limit: number }[] = [];
  const collections = Object.entries(data).map(([tokenId, ids]) => ({ tokenId, tokenCount: ids.length }));
  const fetchItems = async (
    tokenId: string,
    page: number,
    limit: number,
  ): Promise<GetAccountGRC721CollectionItemsResponse> => {
    calls.push({ tokenId, page, limit });
    const ids = data[tokenId];
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, ids.length);
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
      page: { hasNext: end < ids.length, totalCount: ids.length },
    };
  };
  return { calls, collections, fetchItems };
};
const pageIds = (page: AccountNftPage) => page.items.map(item => `${item.tokenId}#${item.nftId}`);

it("fills a global page across collections without losing the remainder on the next page", async () => {
  const { collections, fetchItems } = makeCollectionApi({ a: ["1", "2", "3"], b: ["4", "5", "6"] });
  const first = await fetchAccountNftPage(collections, 1, 4, fetchItems);
  expect(pageIds(first)).toEqual(["a#1", "a#2", "a#3", "b#4"]);
  expect(first.page.hasNext).toBe(true);
  const second = await fetchAccountNftPage(collections, 2, 4, fetchItems);
  expect(pageIds(second)).toEqual(["b#5", "b#6"]);
  expect(second.page).toEqual({ hasNext: false, totalCount: 6 });
});

it("jumps directly to a global page starting inside a collection API page", async () => {
  const { collections, calls, fetchItems } = makeCollectionApi({
    a: ["1", "2", "3"],
    b: ["4", "5", "6", "7", "8", "9"],
  });
  const second = await fetchAccountNftPage(collections, 2, 4, fetchItems);
  expect(pageIds(second)).toEqual(["b#5", "b#6", "b#7", "b#8"]);
  expect(calls).toEqual([
    { tokenId: "b", page: 1, limit: 4 },
    { tokenId: "b", page: 2, limit: 4 },
  ]);
  expect(second.page.hasNext).toBe(true);
});

it("keeps the next collection when a collection ends exactly at the page boundary", async () => {
  const { collections, fetchItems } = makeCollectionApi({ a: ["1", "2"], b: ["3"] });
  const first = await fetchAccountNftPage(collections, 1, 2, fetchItems);
  expect(pageIds(first)).toEqual(["a#1", "a#2"]);
  expect(first.page.hasNext).toBe(true);
  const second = await fetchAccountNftPage(collections, 2, 2, fetchItems);
  expect(pageIds(second)).toEqual(["b#3"]);
  expect(second.page.hasNext).toBe(false);
});
