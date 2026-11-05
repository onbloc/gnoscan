import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTransactionContractsRequest } from "@/repositories/api/transaction/request";
import { GetTransactionContractsResponse } from "@/repositories/api/transaction/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

/**
 * Basic hooks to get transaction contracts data for a specific transaction hash from the API
 *
 * This hook fetches contract data associated with a specific transaction hash directly from the API
 * and returns the data in its original format. It retrieves all contract interactions
 * that occurred within the specified transaction.
 *
 * Notes: This hook provides raw contract data from the API.
 * Use this when you need to access contract interaction details for a specific transaction.
 *
 * @param hash - The transaction hash to query contract data for
 * @param options - @tanstack/react-query options
 * @returns Original contract data associated with the specified transaction hash and the status of the query
 */
export const useGetTransactionContractsByHeight = (
  params: GetTransactionContractsRequest,
  options?: UseQueryOptions<GetTransactionContractsResponse, Error, GetTransactionContractsResponse>,
): UseQueryResult<GetTransactionContractsResponse, Error> => {
  const { apiTransactionRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getTransactionContractsByHash],
    params,
    apiTransactionRepository,
    API_REPOSITORY_KEY.TRANSACTION_REPOSITORY,
    (repository, pageParams) => repository.getTransactionContracts(pageParams),
    { ...options, enabled: (options?.enabled ?? true) && !!params.txHash },
  );
};
