import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetBlockEventsResponse } from "@/repositories/block/response";
import { CommonError } from "@/common/errors";

export const useGetBlockEventsByHeight = (height: string, options?: UseQueryOptions<GetBlockEventsResponse, Error>) => {
  const { apiBlockRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getBlockEventsByHeight, height],
    queryFn: () => {
      if (!apiBlockRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiBlockRepository");
      }
    },
  });
};
