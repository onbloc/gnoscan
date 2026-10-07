import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetGnotPriceResponse } from "@/repositories/api/statistics/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetGnotPrice = (options?: UseQueryOptions<GetGnotPriceResponse, Error, GetGnotPriceResponse>) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getGnotPrice],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getGnotPrice(),
    { staleTime: 60_000, refetchInterval: 60_000, ...options },
  );
};
