import { ValuesType } from "utility-types";

/**
 * Set the maximum query size to a number that is one less than the indexer's maximum query size of 10,000.
 */
export const MAX_QUERY_SIZE = 9_999 as const;

export const API_REPOSITORY_KEY = {
  ACCOUNT_REPOSITORY: "ApiAccountRepository",
  BLOCK_REPOSITORY: "ApiBlockRepository",
  TRANSACTION_REPOSITORY: "ApiTransactionRepository",
  REALM_REPOSITORY: "ApiRealmRepository",
  TOKEN_REPOSITORY: "ApiTokenRepository",
  STATISTICS_REPOSITORY: "ApiStatisticsRepository",
  SEARCH_REPOSITORY: "ApiSearchRepository",
  VALIDATOR_REPOSITORY: "ApiValidatorRepository",
  PRICE_REPOSITORY: "ApiPriceRepository",
};

export type API_REPOSITORY_KEY = ValuesType<typeof API_REPOSITORY_KEY>;

export const RPC_REPOSITORY_KEY = {
  CHAIN_REPOSITORY: "RpcChainRepository",
};

export type RPC_REPOSITORY_KEY = ValuesType<typeof RPC_REPOSITORY_KEY>;

export const DASHBOARD_DATA_REFETCHING_INTERVAL = 5000;
export const PRICES_REFETCH_INTERVAL = 10_000;
// List summaries are cron aggregated every minute, so polling faster only repeats the same rows.
export const LIST_SUMMARY_REFETCH_INTERVAL = 60_000;
export const DEFAULT_LIST_ITEMS_SIZE = 40 as const;
export const ACCOUNTS_LIST_PAGE_SIZE = 100 as const;
export const MAX_ACCOUNTS_LIST_SIZE = 1_000 as const;
/**
 * Cache tiers by how fast the data changes. WARM is the QueryClient default, so only LIVE and COLD are set per query.
 */
export const CACHE_POLICY = {
  // Changes every block
  LIVE: { staleTime: 10_000, cacheTime: 5 * 60_000 },
  // Aggregates that change by the minute
  WARM: { staleTime: 60_000, cacheTime: 5 * 60_000 },
  // Effectively immutable
  COLD: { staleTime: 10 * 60_000, cacheTime: 15 * 60_000, refetchOnWindowFocus: false },
} as const;
