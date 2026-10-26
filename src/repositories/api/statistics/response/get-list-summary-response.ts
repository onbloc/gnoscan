// Summaries shown above the tokens, NFT collections and realms lists.
// 24h and 7d are rolling windows ending at the request. `deltaPct` compares with the previous window of the same
// length, one decimal, and is null when the previous window was 0 while the current one is not ("new").
// `daily` holds 7 UTC days, oldest first, today last (still in progress). Times are RFC3339.

export interface DailyCountModel {
  date: string;
  count: number;
}

export interface TokenActivityDeltaModel {
  tokenId: string;
  /** Transfer events in the last 24h, mints and burns included. */
  transfers24h: number;
  deltaPct: number | null;
}

export interface GetSummaryTokensResponse {
  data: {
    /** Tokens registered in the last 7 days. */
    weeklyNewCount: number;
    /** Every token with transfers in the last 24h, most transfers first, for the Most Active rows. */
    mostActive: TokenActivityDeltaModel[];
    transfers: {
      /** Transfer events in the last 24h across all tokens, mints and burns included. */
      transfers24h: number;
      deltaPct: number | null;
      daily: DailyCountModel[];
      uniqueSenders24h: number;
    };
    holders: {
      /** Distinct addresses with a positive balance of any GRC20 token. */
      holdersTotal: number;
      holdersDelta7d: number;
      fastestGrowing: { tokenId: string; symbol: string; holdersDelta7d: number } | null;
    };
  };
}

export interface JustMintedNftModel {
  tokenId: string;
  packagePath: string;
  collectionName: string;
  nftId: string;
  mintedAt: string;
}

export interface RisingNftCollectionModel {
  tokenId: string;
  packagePath: string;
  name: string;
  mints24h: number;
  newHolders24h: number;
  transfers24h: number;
}

export interface DailyNftActivityModel {
  date: string;
  transfers: number;
  mints: number;
}

export interface GetSummaryNftCollectionsResponse {
  data: {
    /** Newest mints across all collections, at most 3. */
    justMinted: JustMintedNftModel[];
    mintsToday: number;
    /** Ranked by mints24h + newHolders24h, at most 3. */
    rising: RisingNftCollectionModel[];
    activity: {
      /** transfers24h + mints24h. Burns count in neither. */
      events24h: number;
      deltaPct: number | null;
      transfers24h: number;
      mints24h: number;
      daily: DailyNftActivityModel[];
    };
    collectors: {
      /** Distinct addresses owning at least one NFT. */
      holdersTotal: number;
      holdersDelta7d: number;
      topCollector: { address: string; nftCount: number } | null;
      avgPerWallet: number;
    };
  };
}

export interface RealmBuilderModel {
  address: string;
  /** Namespace of the publisher's latest deploy, e.g. gno.land/r/gnoswap. */
  namespace: string;
  deploys7d: number;
  deploysPrev7d: number;
}

export interface MostCalledRealmModel {
  path: string;
  calls24h: number;
  deltaPct: number | null;
  uniqueCallers24h: number;
}

export interface GetSummaryRealmsResponse {
  data: {
    /** Ranked by deploys7d, at most 3. */
    builders: RealmBuilderModel[];
    publishers7d: number;
    /** Ranked by calls24h, at most 3. */
    mostCalled: MostCalledRealmModel[];
    calls: {
      calls24h: number;
      deltaPct: number | null;
      daily: DailyCountModel[];
      uniqueCallers24h: number;
      realmsTouched24h: number;
    };
    /** Storage deposit movement in GNOT. */
    storage: {
      locked24h: number;
      released24h: number;
      bytesDelta24h: number;
      largestRealm: { path: string; depositGnot: number } | null;
    };
  };
}
