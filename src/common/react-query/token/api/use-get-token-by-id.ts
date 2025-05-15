import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenResponse } from "@/repositories/api/token/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

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
  options?: UseQueryOptions<GetTokenResponse, Error, GetTokenResponse>,
) => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getTokenById, tokenId],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    repository => repository.getToken(tokenId),
    options,
  );
};
