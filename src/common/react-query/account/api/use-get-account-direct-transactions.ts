import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountDirectTransactionsRequest } from "@/repositories/api/account/request";
import { GetAccountDirectTransactionsResponse } from "@/repositories/api/account/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetAccountDirectTransactions = (
  params: GetAccountDirectTransactionsRequest,
  options?: UseInfiniteQueryOptions<GetAccountDirectTransactionsResponse, Error, GetAccountDirectTransactionsResponse>,
): UseInfiniteQueryResult<GetAccountDirectTransactionsResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetAccountDirectTransactionsResponse, Error, typeof apiAccountRepository>(
    [QUERY_KEY.getAccountDirectTransactions, params],
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    (repository, pageParam) =>
      repository!.getAccountDirectTransactions({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
      ...options,
      enabled: !!params.address && options?.enabled !== false,
    },
  );
};
