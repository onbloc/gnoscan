import { isAxiosError } from "axios";

export const isStatisticsNotReady = (error: unknown): boolean => isAxiosError(error) && error.response?.status === 404;

export const retryStatisticsQuery = (failureCount: number, error: unknown): boolean =>
  !isStatisticsNotReady(error) && failureCount < 3;

// What the statistics notice reads. `isError` means the statistic is unavailable: it failed and has no data to show.
export interface StatisticsQuery {
  data: unknown;
  error: unknown;
  isError: boolean;
}

// Merges queries that share one notice: the first unavailable one is reported.
export const combineStatisticsQueries = (queries: StatisticsQuery[]): StatisticsQuery => {
  const unavailable = queries.find(query => query.isError);

  return { data: undefined, error: unavailable?.error, isError: unavailable !== undefined };
};
