import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

// Summaries are cron aggregated every minute, so polling faster only repeats the same rows.
export const LIST_SUMMARY_REFETCH_INTERVAL = 60_000;

const summaryOptions = { refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL, retry: 1 };

export const useGetSummaryTokens = () => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getSummaryTokens],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getSummaryTokens(),
    summaryOptions,
  );
};

export const useGetSummaryNftCollections = () => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getSummaryNftCollections],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getSummaryNftCollections(),
    summaryOptions,
  );
};

export const useGetSummaryRealms = () => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getSummaryRealms],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getSummaryRealms(),
    summaryOptions,
  );
};

export const useGetRecentNftMints = (limit: number) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getRecentNftMints, limit],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getRecentNftMints(limit),
    summaryOptions,
  );
};
