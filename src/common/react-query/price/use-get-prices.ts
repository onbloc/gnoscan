import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { buildTokenPriceMap, TokenPriceMap } from "@/common/utils/price.utility";
import { API_REPOSITORY_KEY, PRICES_REFETCH_INTERVAL } from "@/common/values/query.constant";

// The lookup map is built once per fetch and shared through the query cache, not per subscriber.
export const useGetPrices = (options?: UseQueryOptions<TokenPriceMap, Error, TokenPriceMap>) => {
  const { apiPriceRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getPrices],
    apiPriceRepository,
    API_REPOSITORY_KEY.PRICE_REPOSITORY,
    repository => repository.getPrices().then(response => buildTokenPriceMap(response.items)),
    {
      staleTime: PRICES_REFETCH_INTERVAL,
      refetchInterval: PRICES_REFETCH_INTERVAL,
      ...options,
    },
  );
};
