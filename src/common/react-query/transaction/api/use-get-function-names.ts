import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetFunctionNamesResponse } from "@/repositories/api/transaction/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, CACHE_POLICY } from "@/common/values/query.constant";

/**
 * Called function names for the function filter's suggestions, most called first.
 *
 * @param address - Only the functions this account called; omit for every caller
 * @param options - @tanstack/react-query options
 */
export const useGetFunctionNames = (
  address?: string,
  options?: UseQueryOptions<GetFunctionNamesResponse, Error, GetFunctionNamesResponse>,
) => {
  const { apiTransactionRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getFunctionNames, address ?? ""],
    apiTransactionRepository,
    API_REPOSITORY_KEY.TRANSACTION_REPOSITORY,
    repository => repository.getFunctionNames(address),
    { ...CACHE_POLICY.WARM, ...options },
  );
};
