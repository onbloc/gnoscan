import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountEventsRequest } from "@/repositories/api/account/request";
import { GetAccountEventsResponse } from "@/repositories/api/account/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetAccountEvents = (
  params: GetAccountEventsRequest,
  options?: UseInfiniteQueryOptions<GetAccountEventsResponse, Error, GetAccountEventsResponse>,
): UseInfiniteQueryResult<GetAccountEventsResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetAccountEventsResponse, Error, typeof apiAccountRepository>(
    [QUERY_KEY.getAccountEvents, params],
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    (repository, pageParam) =>
      repository!.getAccountEvents({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
      ...options,
    },
  );
};
