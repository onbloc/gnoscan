import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountsResponse } from "@/repositories/api/account/response";
import { GetAccountsRequest } from "@/repositories/api/account/request";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

/**
 * Basic hook to get the accounts list data from the API
 *
 * Fetches a single page of the accounts list (address, name tag, balance,
 * percentage, tx count), ranked by balance, directly from the API.
 *
 * @param params - page and limit to fetch
 * @param options - @tanstack/react-query options
 * @returns Original accounts list data fetched from the API and the status of the query
 */
export const useGetAccounts = (
  params: GetAccountsRequest,
  options?: UseQueryOptions<GetAccountsResponse, Error, GetAccountsResponse>,
) => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getAccounts, params],
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    repository => repository.getAccounts(params),
    {
      keepPreviousData: true,
      ...options,
    },
  );
};
