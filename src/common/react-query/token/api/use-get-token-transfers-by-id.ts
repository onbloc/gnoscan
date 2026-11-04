import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenTransfersResponse } from "@/repositories/api/token/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetTokenTransfersRequest } from "@/repositories/api/token/request";

/**
 * Token page's own "Token Transfers" tab: GRC20/GRC721 library Transfer events
 * where the token itself is the from/to entity (exact registered token match).
 */
export const useGetTokenTransfersById = (
  params: GetTokenTransfersRequest,
  options?: UseQueryOptions<GetTokenTransfersResponse, Error, GetTokenTransfersResponse>,
): UseQueryResult<GetTokenTransfersResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getTokenTransfersById],
    params,
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParams) => repository.getTokenTransfers(pageParams),
    options,
  );
};
