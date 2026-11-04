import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenMetaTransactionsResponse } from "@/repositories/api/token/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetTokenMetaTransactionsRequest } from "@/repositories/api/token/request";

/** Token page's own "Transactions" (direct) tab. */
export const useGetTokenMetaTransactionsById = (
  params: GetTokenMetaTransactionsRequest,
  options?: UseQueryOptions<GetTokenMetaTransactionsResponse, Error, GetTokenMetaTransactionsResponse>,
): UseQueryResult<GetTokenMetaTransactionsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getTokenMetaTransactionsById],
    params,
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParams) => repository.getTokenMetaTransactions(pageParams),
    options,
  );
};
