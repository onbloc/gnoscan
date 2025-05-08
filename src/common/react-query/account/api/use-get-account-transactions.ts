import { useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountTransactionsRequest } from "@/repositories/api/account/request";
import { GetAccountTransactionsResponse } from "@/repositories/api/account/response";
import { CommonError } from "@/common/errors";

export const useGetAccountTransactions = (
  params: GetAccountTransactionsRequest,
  options?: UseInfiniteQueryOptions<GetAccountTransactionsResponse, CommonError, GetAccountTransactionsResponse>,
): UseInfiniteQueryResult<GetAccountTransactionsResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.getAccountTransactions, params],
    queryFn: ({ pageParam }) => {
      if (!apiAccountRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiAccountRepository");
      }

      return apiAccountRepository.getAccountTransactions({
        ...params,
        cursor: pageParam,
      });
    },
    getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    ...options,
  });
};
