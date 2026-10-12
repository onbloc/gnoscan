import {
  AccountGRC721CollectionItemModel,
  GetAccountGRC721CollectionItemsResponse,
} from "@/repositories/api/account/response";

export interface AccountNftPage {
  items: AccountGRC721CollectionItemModel[];
  page: {
    hasNext: boolean;
    cursor?: string;
  };
}

interface AccountNftCursor {
  // Index into the collection list being paged
  index: number;
  // Cursor inside that collection; undefined starts the collection from its first item
  cursor?: string;
}

/**
 * Fetches one page of an account's NFTs across several collections.
 *
 * The API pages NFTs per collection only, so collections are walked in order and their pages are
 * chained: a page that exhausts one collection is topped up from the next one. The returned cursor
 * encodes the collection index together with the collection's own cursor.
 */
export async function fetchAccountNftPage(
  collectionTokenIds: string[],
  pageCursor: string | undefined,
  limit: number,
  fetchCollectionItems: (
    tokenId: string,
    cursor: string | undefined,
    limit: number,
  ) => Promise<GetAccountGRC721CollectionItemsResponse>,
): Promise<AccountNftPage> {
  let { index, cursor }: AccountNftCursor = pageCursor ? JSON.parse(pageCursor) : { index: 0 };
  const items: AccountGRC721CollectionItemModel[] = [];

  while (index < collectionTokenIds.length && items.length < limit) {
    const response = await fetchCollectionItems(collectionTokenIds[index], cursor, limit - items.length);
    items.push(...response.items);

    if (response.page.hasNext && response.page.cursor) {
      cursor = response.page.cursor;
    } else {
      index += 1;
      cursor = undefined;
    }
  }

  const hasNext = index < collectionTokenIds.length;

  return {
    items,
    page: {
      hasNext,
      cursor: hasNext ? JSON.stringify({ index, cursor } satisfies AccountNftCursor) : undefined,
    },
  };
}
