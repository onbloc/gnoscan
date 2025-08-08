import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { StorageDeposit } from "@/models/storage-deposit-model";

export const useGetTotalStorageDeposit = (
  options?: UseQueryOptions<StorageDeposit | null, Error, StorageDeposit | null>,
) => {
  const { apiStatisticsRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getTotalStorageDeposit],
    apiStatisticsRepository,
    API_REPOSITORY_KEY.STATISTICS_REPOSITORY,
    repository => repository.getTotalStorageDeposit(), // TODO: gno.land/r/demo/boards
    options,
  );
};
