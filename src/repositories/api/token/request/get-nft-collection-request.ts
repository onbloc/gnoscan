export interface GetNftCollectionsRequest {
  packagePath?: string;
  cursor?: string;
  limit?: number;
}

// tokenKey: collection token ID (e.g. gno.land/r/gnoswap/gnft.GNFT.0000000) or its realm path
export interface GetNftCollectionItemsRequest {
  tokenKey: string;
  cursor?: string;
  limit?: number;
}

export interface GetNftCollectionHoldersRequest {
  tokenKey: string;
  cursor?: string;
  limit?: number;
}
