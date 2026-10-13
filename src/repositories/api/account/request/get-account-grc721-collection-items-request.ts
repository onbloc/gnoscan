export interface GetAccountGRC721CollectionItemsRequest {
  address: string;

  // Collection token ID (e.g. gno.land/r/gnoswap/gnft.GNFT.0000000) or its realm path
  tokenId: string;

  page?: number;

  limit?: number;
}
