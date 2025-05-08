import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetSummaryTransactionsResponse } from "@/repositories/api/statistics/response";
import { CommonError } from "@/common/errors";

export const useGetSummaryTransactions = (
  options?: UseQueryOptions<GetSummaryTransactionsResponse, Error, GetSummaryTransactionsResponse>,
) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getSummaryTransactions],
    queryFn: () => {
      if (!apiStatisticsRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiStatisticsRepository");
      }

      return apiStatisticsRepository.getSummaryTransactions();
    },
    ...options,
  });
};
