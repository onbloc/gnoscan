import { isAxiosError } from "axios";

export const isStatisticsNotReady = (error: unknown): boolean => isAxiosError(error) && error.response?.status === 404;

export const retryStatisticsQuery = (failureCount: number, error: unknown): boolean =>
  !isStatisticsNotReady(error) && failureCount < 3;

// The subset of a react-query result the statistics notice reads.
export interface StatisticsQuery {
  data: unknown;
  error: unknown;
  isError: boolean;
  isFetching: boolean;
  refetch: () => unknown;
}

// Merges queries that share one notice: it reports a failed query without data first and retries every failed one.
export const combineStatisticsQueries = (queries: StatisticsQuery[]): StatisticsQuery => {
  const failed = queries.filter(query => query.isError);
  const shown = failed.find(query => query.data === undefined) ?? failed[0];

  return {
    data: shown?.data,
    error: shown?.error,
    isError: failed.length > 0,
    isFetching: failed.some(query => query.isFetching),
    refetch: () => Promise.all(failed.map(query => query.refetch())),
  };
};
