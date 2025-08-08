import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { RPC_REPOSITORY_KEY } from "@/common/values/query.constant";
import { Amount } from "@/types";

export const useGetStoragePrice = (options?: UseQueryOptions<Amount | null, Error, Amount | null>) => {
  const { chainRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getStoragePrice],
    chainRepository,
    RPC_REPOSITORY_KEY.CHAIN_REPOSITORY,
    repository => repository.getStoragePrice(),
    options,
  );
};
