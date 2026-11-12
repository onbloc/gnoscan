import { UseQueryOptions, UseQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetTokenEventsResponse } from "@/repositories/api/token/response";
import { useApiRepositoryPageQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetTokenEventsRequest } from "@/repositories/api/token/request";

export const useGetTokenEventsById = (
  params: GetTokenEventsRequest,
  options?: UseQueryOptions<GetTokenEventsResponse, Error, GetTokenEventsResponse>,
): UseQueryResult<GetTokenEventsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryPageQuery(
    [QUERY_KEY.getTokenEventsById],
    params,
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, pageParams) => repository.getTokenEvents(pageParams),
    options,
  );
};
