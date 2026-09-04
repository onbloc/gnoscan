import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTransactionPendingResponse } from "@/repositories/api/transaction/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

/**
 * Checks whether a transaction hash is currently sitting in the gno node's mempool.
 *
 * Only meaningful once GET /v1/transactions/{hash} has come back not-found — this is
 * the fallback lookup for a tx that hasn't been confirmed (or indexed) yet.
 *
 * @param hash - The transaction hash to query for
 * @param options - @tanstack/react-query options
 */
export const useGetTransactionPending = (
  hash: string,
  options?: UseQueryOptions<GetTransactionPendingResponse, Error, GetTransactionPendingResponse>,
) => {
  const { apiTransactionRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getTransactionPendingByHash, hash],
    apiTransactionRepository,
    API_REPOSITORY_KEY.TRANSACTION_REPOSITORY,
    repository => repository.getTransactionPending(hash),
    { enabled: !!hash, retry: false, ...options },
  );
};
