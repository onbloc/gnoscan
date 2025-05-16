import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenTransactionsResponse } from "@/repositories/api/token/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetTokenTransactionsRequest } from "@/repositories/api/token/request";

/**
 * Basic hooks to get token transactions data from the API
 *
 * This hook fetches transactions data for a specific token directly from the API and returns the data in its original format.
 * Uses the token ID to retrieve all transactions associated with that token.
 *
 * Notes: The source data returned by this hook is found in `use-api-token-transactions.ts`.
 * mapped to the format used by your application.
 *
 * @param tokenId - The unique identifier for the token to fetch its transactions
 * @param options - @tanstack/react-query options
 * @returns Original token transactions data fetched from the API and the status of the query
 */
export const useGetTokenTransactionsByid = (
  params: GetTokenTransactionsRequest,
  options?: UseInfiniteQueryOptions<GetTokenTransactionsResponse, Error, GetTokenTransactionsResponse>,
): UseInfiniteQueryResult<GetTokenTransactionsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetTokenTransactionsResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokenTransactionsById, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParam) =>
      repository!.getTokenTransactions({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
