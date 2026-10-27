// Summaries shown above the tokens, NFT collections and realms lists.
// 24h and 7d are rolling windows ending at the request. `deltaPct` compares with the previous window of the same
// length, one decimal, and is null when the previous window was 0 while the current one is not ("new").
// `daily` holds the 7 back to back 24h periods ending at the request, oldest first, so the last one is the 24h figure
// and `deltaPct` compares the last two. Times are RFC3339.

export interface SummaryPeriodModel {
  start: string;
  end: string;
}

export interface DailyCountModel extends SummaryPeriodModel {
  count: number;
}

/** A token in a summary row, with the fields the token list item uses for its name, logo and link. */
export interface SummaryTokenModel {
  tokenId: string;
  packagePath: string;
  name: string;
  symbol: string;
  logoUrl: string | null;
}

/** Transactions counted like the token list's transactionCount24h. */
export interface ActiveTokenModel extends SummaryTokenModel {
  transfers24h: number;
  deltaPct: number | null;
}

/** Token that gained the most holders over the last 7 days. */
export interface FastestGrowingTokenModel extends SummaryTokenModel {
  holdersDelta7d: number;
}

export interface MostHeldTokenModel extends SummaryTokenModel {
  holders: number;
}

export interface GetSummaryTokensResponse {
  data: {
    /** Tokens created in the last 7 days. */
    weeklyNewCount: number;
    /** Top 3 tokens by 24h transactions, most first. */
    mostActive: ActiveTokenModel[];
    transfers: {
      /** Sum of the per token 24h transaction counts. */
      count24h: number;
      /** Tokens with at least one transaction in the last 24h. */
      activeTokens24h: number;
      deltaPct: number | null;
      daily: DailyCountModel[];
      uniqueSenders24h: number;
    };
    holders: {
      /** Distinct addresses with a positive balance of any GRC20 token. */
      holdersTotal: number;
      /** Token with the most holders, as the first row of the holders sorted list. */
      mostHeld: MostHeldTokenModel | null;
      /** null when no token gained holders over the last 7 days. */
      fastestGrowing: FastestGrowingTokenModel | null;
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

export interface DailyNftActivityModel extends SummaryPeriodModel {
  transfers: number;
  mints: number;
}

export interface GetSummaryNftCollectionsResponse {
  data: {
    /** Newest mints across all collections, at most 3. */
    justMinted: JustMintedNftModel[];
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
    /** User wallets only. NFTs that realms hold for users, such as staked positions, are counted in realmHeld. */
    collectors: {
      /** Distinct user wallets owning at least one NFT. */
      holdersTotal: number;
      topCollector: { address: string; nftCount: number } | null;
      /** userHeld / holdersTotal, one decimal. */
      avgPerWallet: number;
      userHeld: number;
      realmHeld: number;
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
