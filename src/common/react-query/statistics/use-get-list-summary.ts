import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, LIST_SUMMARY_REFETCH_INTERVAL } from "@/common/values/query.constant";

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
