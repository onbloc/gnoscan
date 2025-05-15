import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetSearchAutocompleteResponse } from "@/repositories/api/search/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export const useGetSearchAutocomplete = (
  keyword: string,
  options?: UseQueryOptions<GetSearchAutocompleteResponse, Error, GetSearchAutocompleteResponse>,
) => {
  const { apiSearchRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getSearchAutocomplete, keyword],
    apiSearchRepository,
    API_REPOSITORY_KEY.SEARCH_REPOSITORY,
    repository => repository.getSearchAutocomplete(keyword),
    { enabled: keyword.length > 1 && options?.enabled !== false },
  );
};
