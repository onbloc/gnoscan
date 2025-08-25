import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetStorageDepositResponse } from "@/repositories/api/statistics/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetStorageDeposit = (
  options?: UseQueryOptions<GetStorageDepositResponse, Error, GetStorageDepositResponse>,
) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getStorageDeposit],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getStorageDeposit(),
    options,
  );
};
