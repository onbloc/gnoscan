import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountResponse } from "@/repositories/api/account/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetAccountByAddress = (
  address: string,
  options?: UseQueryOptions<GetAccountResponse, Error, GetAccountResponse>,
) => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getAccount, address],
    apiAccountRepository,
    API_REPOSITORY_KEY.REALM_REPOSITORY,
    repository => repository.getAccount(address),
    options,
  );
};
