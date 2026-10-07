import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetPricesResponse } from "@/repositories/api/price/response";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY, PRICES_REFETCH_INTERVAL } from "@/common/values/query.constant";

export const useGetPrices = (options?: UseQueryOptions<GetPricesResponse, Error, GetPricesResponse>) => {
  const { apiPriceRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getPrices],
    apiPriceRepository,
    API_REPOSITORY_KEY.PRICE_REPOSITORY,
    repository => repository.getPrices(),
    {
      staleTime: PRICES_REFETCH_INTERVAL,
      refetchInterval: PRICES_REFETCH_INTERVAL,
      ...options,
    },
  );
};
