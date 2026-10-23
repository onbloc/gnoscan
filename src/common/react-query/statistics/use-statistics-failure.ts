import { useState } from "react";
import { StatisticsQuery } from "./statistics-query-policy";

type StatisticsQueryResult = StatisticsQuery & { errorUpdatedAt: number };

// Reports whether a statistic is unavailable: its query failed and there is no data to show.
// react-query clears the error of a data-less query on every refetch, which makes a polled card flicker between its
// notice and a skeleton. The failure is kept until data arrives or another query (a different key) takes over.
export const useStatisticsFailure = (query: StatisticsQueryResult): StatisticsQuery => {
  const [failure, setFailure] = useState<{ error: unknown } | null>(null);

  let current = failure;
  if (query.isError) {
    current = failure?.error === query.error ? failure : { error: query.error };
  } else if (query.data !== undefined || query.errorUpdatedAt === 0) {
    current = null;
  }
  if (current !== failure) setFailure(current);

  return { data: query.data, error: current?.error, isError: current !== null && query.data === undefined };
};
