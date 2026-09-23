import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountTokenTransfersRequest } from "@/repositories/api/account/request";
import { GetAccountTokenTransfersResponse } from "@/repositories/api/account/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetAccountTokenTransfers = (
  params: GetAccountTokenTransfersRequest,
  options?: UseInfiniteQueryOptions<GetAccountTokenTransfersResponse, Error, GetAccountTokenTransfersResponse>,
): UseInfiniteQueryResult<GetAccountTokenTransfersResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetAccountTokenTransfersResponse, Error, typeof apiAccountRepository>(
    [QUERY_KEY.getAccountTokenTransfers, params],
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    (repository, pageParam) =>
      repository!.getAccountTokenTransfers({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
      ...options,
      enabled: !!params.address && options?.enabled !== false,
    },
  );
};
