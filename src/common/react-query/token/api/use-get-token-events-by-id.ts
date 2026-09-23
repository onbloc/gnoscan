import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenEventsResponse } from "@/repositories/api/token/response";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetTokenEventsRequest } from "@/repositories/api/token/request";

export const useGetTokenEventsById = (
  params: GetTokenEventsRequest,
  options?: UseInfiniteQueryOptions<GetTokenEventsResponse, Error, GetTokenEventsResponse>,
): UseInfiniteQueryResult<GetTokenEventsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetTokenEventsResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokenEventsById, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParam) =>
      repository!.getTokenEvents({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    {
      ...options,
      getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    },
  );
};
