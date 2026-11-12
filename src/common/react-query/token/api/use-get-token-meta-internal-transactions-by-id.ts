import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenMetaInternalTransactionsResponse } from "@/repositories/api/token/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetTokenMetaInternalTransactionsRequest } from "@/repositories/api/token/request";

export const useGetTokenMetaInternalTransactionsById = (
  params: GetTokenMetaInternalTransactionsRequest,
  options?: UseQueryOptions<GetTokenMetaInternalTransactionsResponse, Error, GetTokenMetaInternalTransactionsResponse>,
): UseQueryResult<GetTokenMetaInternalTransactionsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getTokenMetaInternalTransactionsById],
    params,
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParams) => repository.getTokenMetaInternalTransactions(pageParams),
    options,
  );
};
