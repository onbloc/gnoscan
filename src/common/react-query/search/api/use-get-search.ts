import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetSearchResponse } from "@/repositories/api/search/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetSearch = (param: string, options: UseQueryOptions<GetSearchResponse, Error, GetSearchResponse>) => {
  const { apiSearchRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getSearch, param],
    apiSearchRepository,
    API_REPOSITORY_KEY.SEARCH_REPOSITORY,
    repository => repository.getSearch(param),
    { enabled: param.length > 0 && options?.enabled !== false },
  );
};
