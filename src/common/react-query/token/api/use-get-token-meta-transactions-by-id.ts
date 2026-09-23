import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenMetaTransactionsResponse } from "@/repositories/api/token/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetTokenMetaTransactionsRequest } from "@/repositories/api/token/request";

/** Token page's own "Transactions" (direct) tab. */
export const useGetTokenMetaTransactionsById = (
  params: GetTokenMetaTransactionsRequest,
  options?: UseInfiniteQueryOptions<GetTokenMetaTransactionsResponse, Error, GetTokenMetaTransactionsResponse>,
): UseInfiniteQueryResult<GetTokenMetaTransactionsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetTokenMetaTransactionsResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokenMetaTransactionsById, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParam) =>
      repository!.getTokenMetaTransactions({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
