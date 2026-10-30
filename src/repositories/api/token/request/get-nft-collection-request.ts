export interface GetNftCollectionsRequest {
  packagePath?: string;
  cursor?: string;
  limit?: number;
  sort?: "id" | "holders" | "transfers" | "totalSupply";
  order?: "asc" | "desc";

  /** Matches name, symbol or package path. */
  keyword?: string;
}

// tokenKey: collection token ID (e.g. gno.land/r/gnoswap/gnft.GNFT.0000000) or its realm path
export interface GetNftCollectionItemsRequest {
  tokenKey: string;
  page?: number;
  limit?: number;
}

export interface GetNftItemTransfersRequest {
  tokenKey: string;
  nftId: string;
  page?: number;
  limit?: number;
}
