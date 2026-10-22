import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetMonthlyActiveAccountsResponse } from "@/repositories/api/statistics/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { retryStatisticsQuery } from "./statistics-query-policy";

export const useGetMonthlyActiveAccounts = (
  options?: UseQueryOptions<GetMonthlyActiveAccountsResponse, Error, GetMonthlyActiveAccountsResponse>,
) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getMonthlyActiveAccounts],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getMonthlyActiveAccounts(),
    { retry: retryStatisticsQuery, ...options },
  );
};
