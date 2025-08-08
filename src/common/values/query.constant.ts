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
};

export type API_REPOSITORY_KEY = ValuesType<typeof API_REPOSITORY_KEY>;

export const RPC_REPOSITORY_KEY = {
  CHAIN_REPOSITORY: "RpcChainRepository",
};

export type RPC_REPOSITORY_KEY = ValuesType<typeof RPC_REPOSITORY_KEY>;

export const DASHBOARD_DATA_REFETCHING_INTERVAL = 5000;
export const DEFAULT_LIST_ITEMS_SIZE = 40 as const;
export const DEFAULT_LIST_ITEMS_CACHE_TIME = 5 * 60 * 1000;
export const DEFAULT_LIST_ITEMS_STALE_TIME = 3 * 60 * 1000;
