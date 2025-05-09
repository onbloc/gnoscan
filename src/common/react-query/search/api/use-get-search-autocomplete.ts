import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetSearchAutocompleteResponse } from "@/repositories/api/search/response";
import { CommonError } from "@/common/errors";

export const useGetSearchAutocomplete = (
  keyword: string,
  options?: UseQueryOptions<GetSearchAutocompleteResponse, Error, GetSearchAutocompleteResponse>,
) => {
  const { apiSearchRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getSearchAutocomplete, keyword],
    queryFn: () => {
      if (!apiSearchRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiTokenRepository");
      }

      return apiSearchRepository.getSearchAutocomplete(keyword);
    },
    ...options,
    enabled: keyword.length > 1 && options?.enabled,
  });
};
