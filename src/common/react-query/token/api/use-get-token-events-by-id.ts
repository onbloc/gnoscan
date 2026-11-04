import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenEventsResponse } from "@/repositories/api/token/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";
import { GetTokenEventsRequest } from "@/repositories/api/token/request";

export const useGetTokenEventsById = (
  params: GetTokenEventsRequest,
  options?: UseQueryOptions<GetTokenEventsResponse, Error, GetTokenEventsResponse>,
): UseQueryResult<GetTokenEventsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryQuery<GetTokenEventsResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getTokenEventsById, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    repository =>
      repository!.getTokenEvents({
        ...params,
        limit: params.limit ?? DEFAULT_LIST_ITEMS_SIZE,
      }),
    { keepPreviousData: true, ...options },
  );
};
