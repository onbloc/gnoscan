import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetValidatorCommitsRequest } from "@/repositories/api/validator/request";
import { GetValidatorCommitsResponse } from "@/repositories/api/validator/response";

const COMMIT_REFETCH_INTERVAL = 3000;

export const useGetValidatorCommits = (
  params: GetValidatorCommitsRequest,
  options?: UseQueryOptions<GetValidatorCommitsResponse, Error, GetValidatorCommitsResponse>,
) => {
  const { apiValidatorRepository } = useServiceProvider();

  return useApiRepositoryQuery<GetValidatorCommitsResponse, Error, typeof apiValidatorRepository>(
    [QUERY_KEY.getValidatorCommits, params],
    apiValidatorRepository,
    API_REPOSITORY_KEY.VALIDATOR_REPOSITORY,
    repository => repository!.getValidatorCommits(params),
    {
      refetchInterval: COMMIT_REFETCH_INTERVAL,
      ...options,
    },
  );
};
