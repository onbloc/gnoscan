import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTotalDailyTransactionsResponse } from "@/repositories/api/statistics/response";
import { CommonError } from "@/common/errors";

export const useGetTotalDailyTransactions = (
  options?: UseQueryOptions<GetTotalDailyTransactionsResponse, Error, GetTotalDailyTransactionsResponse>,
) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getTotalDailyTransactions],
    queryFn: () => {
      if (!apiStatisticsRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiStatisticsRepository");
      }

      return apiStatisticsRepository.getTotalDailyTransactions();
    },
    ...options,
  });
};
