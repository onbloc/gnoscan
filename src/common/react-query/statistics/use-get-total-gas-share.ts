import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTotalFeeShareRequest } from "@/repositories/api/statistics/request";
import { GetTotalFeeShareResponse } from "@/repositories/api/statistics/response";
import { CommonError } from "@/common/errors";

export const useGetTotalGasShare = (
  request: GetTotalFeeShareRequest,
  options?: UseQueryOptions<GetTotalFeeShareResponse, Error, GetTotalFeeShareResponse>,
) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getTotalGasShare, request.range],
    queryFn: () => {
      if (!apiStatisticsRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiStatisticsRepository");
      }

      return apiStatisticsRepository.getTotalGasShare(request);
    },
    ...options,
  });
};
