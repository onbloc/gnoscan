import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTotalFeeShareRequest } from "@/repositories/api/statistics/request";
import { GetTotalFeeShareResponse } from "@/repositories/api/statistics/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetTotalGasShare = (
  request: GetTotalFeeShareRequest,
  options?: UseQueryOptions<GetTotalFeeShareResponse, Error, GetTotalFeeShareResponse>,
) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getTotalGasShare, request.range],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getTotalGasShare(request),
    options,
  );
};
