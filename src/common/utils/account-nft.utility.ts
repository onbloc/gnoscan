import {
  AccountGRC721CollectionModel,
  GetAccountGRC721CollectionItemsResponse,
} from "@/repositories/api/account/response";

export type AccountNftPage = GetAccountGRC721CollectionItemsResponse;

// Resolve a global account page directly against per-collection numbered pages.
// Keep a fixed request limit: changing it changes the backend page's offset.
export async function fetchAccountNftPage(
  collections: Pick<AccountGRC721CollectionModel, "tokenId" | "tokenCount">[],
  page: number,
  limit: number,
  fetchCollectionItems: (
    tokenId: string,
    page: number,
    limit: number,
  ) => Promise<GetAccountGRC721CollectionItemsResponse>,
): Promise<AccountNftPage> {
  const items: AccountNftPage["items"] = [];
  const totalCount = collections.reduce((total, collection) => total + collection.tokenCount, 0);
  const start = (page - 1) * limit;
  let offset = start;

  for (const collection of collections) {
    if (offset >= collection.tokenCount) {
      offset -= collection.tokenCount;
      continue;
    }
    let collectionPage = Math.floor(offset / limit) + 1;
    let withinPage = offset % limit;
    while (items.length < limit) {
      const response = await fetchCollectionItems(collection.tokenId, collectionPage, limit);
      items.push(...response.items.slice(withinPage, withinPage + limit - items.length));
      if (!response.page.hasNext) break;
      collectionPage += 1;
      withinPage = 0;
    }
    if (items.length === limit) break;
    offset = 0;
  }

  return { items, page: { totalCount, hasNext: start + items.length < totalCount } };
}
