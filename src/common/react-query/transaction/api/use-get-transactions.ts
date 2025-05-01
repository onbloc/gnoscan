import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { CommonError } from "@/common/errors";
import { GetTransactionsRequestParameters } from "@/repositories/api/transaction/request";

export const useGetTransactions = (params: GetTransactionsRequestParameters = {}, options?: UseQueryOptions) => {
  const { apiBlockRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getTransactions, params],
    queryFn: () => {
      if (!apiBlockRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiBlockRepository");
      }
    },
  });
};
