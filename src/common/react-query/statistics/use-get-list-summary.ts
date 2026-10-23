import { useRouter } from "next/router";
import { UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, LIST_SUMMARY_REFETCH_INTERVAL } from "@/common/values/query.constant";
import {
  MOCK_SUMMARY_NFT_COLLECTIONS,
  MOCK_SUMMARY_REALMS,
  MOCK_SUMMARY_TOKENS,
} from "@/repositories/api/statistics/response/list-summary-mock";

const summaryOptions = { refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL, retry: 1 };

// `?summaryMock` in the URL swaps the summary API for sample data, for reviewing the cards before the API exists.
// ponytail: remove with the mock file once the summary API ships.
const useIsSummaryMock = () => useRouter().query.summaryMock !== undefined;

const withMock = <T>(query: UseQueryResult<T, Error>, isMock: boolean, mock: T) =>
  isMock ? ({ ...query, data: mock, isFetched: true, isError: false } as UseQueryResult<T, Error>) : query;

export const useGetSummaryTokens = () => {
  const { apiStatisticsRepository } = useServiceProvider();
  const isMock = useIsSummaryMock();

  const query = useApiRepositoryQuery(
    [QUERY_KEY.getSummaryTokens],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getSummaryTokens(),
    { ...summaryOptions, enabled: !isMock },
  );
  return withMock(query, isMock, MOCK_SUMMARY_TOKENS);
};

export const useGetSummaryNftCollections = () => {
  const { apiStatisticsRepository } = useServiceProvider();
  const isMock = useIsSummaryMock();

  const query = useApiRepositoryQuery(
    [QUERY_KEY.getSummaryNftCollections],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getSummaryNftCollections(),
    { ...summaryOptions, enabled: !isMock },
  );
  return withMock(query, isMock, MOCK_SUMMARY_NFT_COLLECTIONS);
};

export const useGetSummaryRealms = () => {
  const { apiStatisticsRepository } = useServiceProvider();
  const isMock = useIsSummaryMock();

  const query = useApiRepositoryQuery(
    [QUERY_KEY.getSummaryRealms],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getSummaryRealms(),
    { ...summaryOptions, enabled: !isMock },
  );
  return withMock(query, isMock, MOCK_SUMMARY_REALMS);
};
