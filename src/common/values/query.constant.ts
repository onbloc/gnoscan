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

export const DASHBOARD_DATA_REFETCHING_INTERVAL = 5000;
