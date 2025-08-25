import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTotalRealmStorageDepositRequest } from "@/repositories/api/statistics/request";
import { GetTotalRealmStorageDepositResponse } from "@/repositories/api/statistics/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetTotalDailyRealmStorageDeposit = (
  request: GetTotalRealmStorageDepositRequest,
  options?: UseQueryOptions<GetTotalRealmStorageDepositResponse, Error, GetTotalRealmStorageDepositResponse>,
) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getTotalDailyRealmStorageDeposit, request.range],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getTotalDailyRealmStorageDeposit(request),
    options,
  );
};
