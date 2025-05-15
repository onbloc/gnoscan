import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountTransactionsRequest } from "@/repositories/api/account/request";
import { GetAccountTransactionsResponse } from "@/repositories/api/account/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { CommonError } from "@/common/errors";

export const useGetAccountTransactions = (
  params: GetAccountTransactionsRequest,
  options?: UseInfiniteQueryOptions<GetAccountTransactionsResponse, Error, GetAccountTransactionsResponse>,
): UseInfiniteQueryResult<GetAccountTransactionsResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetAccountTransactionsResponse, Error, typeof apiAccountRepository>(
    [QUERY_KEY.getAccountTransactions, params],
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    (repository, pageParam) => {
      if (!repository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", API_REPOSITORY_KEY.ACCOUNT_REPOSITORY);
      }

      return repository.getAccountTransactions({
        ...params,
        cursor: pageParam as string | undefined,
      });
    },
    {
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
      ...options,
      enabled: !!params.address,
    },
  );
};
