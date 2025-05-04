import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetSummarySupplyResponse } from "@/repositories/api/statistics/response";
import { CommonError } from "@/common/errors";

export const useGetSummarySupply = (
  options?: UseQueryOptions<GetSummarySupplyResponse, Error, GetSummarySupplyResponse>,
) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getSummarySupply],
    queryFn: () => {
      if (!apiStatisticsRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiStatisticsRepository");
      }

      return apiStatisticsRepository.getSummarySupply();
    },
    ...options,
  });
};
