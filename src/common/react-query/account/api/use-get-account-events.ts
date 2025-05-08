import { useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountEventsRequest } from "@/repositories/api/account/request";
import { GetAccountEventsResponse } from "@/repositories/api/account/response";
import { CommonError } from "@/common/errors";

export const useGetAccountEvents = (
  params: GetAccountEventsRequest,
  options?: UseInfiniteQueryOptions<GetAccountEventsResponse, CommonError, GetAccountEventsResponse>,
): UseInfiniteQueryResult<GetAccountEventsResponse, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.getAccountEvents, params],
    queryFn: ({ pageParam }) => {
      if (!apiAccountRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiAccountRepository");
      }

      return apiAccountRepository.getAccountEvents({
        ...params,
        cursor: pageParam,
      });
    },
    getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    ...options,
  });
};
