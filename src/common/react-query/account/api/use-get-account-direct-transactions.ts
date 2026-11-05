import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountDirectTransactionsRequest } from "@/repositories/api/account/request";
import { GetAccountDirectTransactionsResponse } from "@/repositories/api/account/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, CACHE_POLICY } from "@/common/values/query.constant";

export const useGetAccountDirectTransactions = (
  params: GetAccountDirectTransactionsRequest,
  options?: UseQueryOptions<GetAccountDirectTransactionsResponse, Error, GetAccountDirectTransactionsResponse>,
): UseQueryResult<GetAccountDirectTransactionsResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getAccountDirectTransactions],
    params,
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    (repository, pageParams) => repository.getAccountDirectTransactions(pageParams),
    {
      ...CACHE_POLICY.LIVE,
      ...options,
      enabled: !!params.address && options?.enabled !== false,
    },
  );
};
