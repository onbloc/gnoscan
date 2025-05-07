import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenResponse } from "@/repositories/api/token/response";
import { CommonError } from "@/common/errors";

/**
 * Basic hooks to get token data from the API
 *
 * This hook fetches a single token data directly from the API and returns the data in its original format.
 * Uses the token ID to identify and retrieve the specific token.
 *
 * Notes: The source data returned by this hook is found in `use-api-token.ts`.
 * mapped to the format used by your application.
 *
 * @param tokenId - The unique identifier for the specific token
 * @param options - @tanstack/react-query options
 * @returns Original token data fetched from the API and the status of the query
 */
export const useGetTokenById = (
  tokenId: string,
  optoins?: UseQueryOptions<GetTokenResponse, Error, GetTokenResponse>,
) => {
  const { apiTokenRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getTokenById, tokenId],
    queryFn: () => {
      if (!apiTokenRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiTokenRepository");
      }

      return apiTokenRepository.getToken(tokenId);
    },
    ...optoins,
  });
};
