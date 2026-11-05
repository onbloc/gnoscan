import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTransactionFunctionNamesRequestParameters } from "@/repositories/api/transaction/request";
import { GetTransactionFunctionNamesResponse } from "@/repositories/api/transaction/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, CACHE_POLICY } from "@/common/values/query.constant";

/**
 * Function labels of the transaction Function filter, most used first.
 *
 * @param params - API request parameters
 * @param options - @tanstack/react-query options
 */
export const useGetTransactionFunctionNames = (
  params: GetTransactionFunctionNamesRequestParameters = {},
  options?: UseQueryOptions<GetTransactionFunctionNamesResponse, Error, GetTransactionFunctionNamesResponse>,
): UseQueryResult<GetTransactionFunctionNamesResponse, Error> => {
  const { apiTransactionRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getTransactionFunctionNames, params],
    apiTransactionRepository,
    API_REPOSITORY_KEY.TRANSACTION_REPOSITORY,
    repository => repository.getTransactionFunctionNames(params),
    { ...CACHE_POLICY.WARM, ...options },
  );
};
