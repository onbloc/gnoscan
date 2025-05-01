import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenTransactionsResponse } from "@/repositories/api/token/response";
import { CommonError } from "@/common/errors";

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
  tokenId: string,
  optoins?: UseQueryOptions<GetTokenTransactionsResponse, Error, GetTokenTransactionsResponse>,
) => {
  const { apiTokenRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getTokenTransactionsById, tokenId],
    queryFn: () => {
      if (!apiTokenRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiTokenRepository");
      }

      return apiTokenRepository.getTokenTransactions(tokenId);
    },
    ...optoins,
  });
};
