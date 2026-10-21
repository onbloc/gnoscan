// Summaries shown above the tokens, NFT collections and realms lists.
// `new24h`, `transfers24h` and the other 24h fields count activity in the last 24 hours.

export interface GetSummaryTokensResponse {
  data: {
    total: number;
    new24h: number;
    /** Distinct addresses with a positive balance of any GRC20 token. */
    holders: number;
  };
}

export interface TrendingNftCollectionModel {
  tokenId: string;
  name: string;
  symbol: string;
  packagePath: string;
  mints24h: number;
  transfers24h: number;
}

export interface GetSummaryNftCollectionsResponse {
  data: {
    total: number;
    new24h: number;
    /** Distinct addresses owning at least one NFT of any collection. */
    holders: number;
    transfers24h: number;
    /** Most active collections in the last 24 hours, at most 3, most active first. */
    trending: TrendingNftCollectionModel[];
  };
}

export interface TrendingRealmModel {
  path: string;
  publisher: string;
  publisherName: string;
  calls24h: number;
}

export interface GetSummaryRealmsResponse {
  data: {
    total: number;
    new24h: number;
    calls24h: number;
    activeCallers24h: number;
    /** Most called realms in the last 24 hours, at most 3, most called first. */
    trending: TrendingRealmModel[];
  };
}

export interface RecentNftMintModel {
  tokenId: string;
  packagePath: string;
  nftId: string;
  name: string;
  symbol: string;
  blockHeight: number;
  /** RFC3339 block time of the mint. */
  mintedAt: string;
}

export interface GetRecentNftMintsResponse {
  /** Newest first. */
  items: RecentNftMintModel[];
}
