import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetValidatorsRequest } from "@/repositories/api/validator/request";
import { GetValidatorsResponse } from "@/repositories/api/validator/response";

export const useGetValidators = (
  params: GetValidatorsRequest,
  options?: UseQueryOptions<GetValidatorsResponse, Error, GetValidatorsResponse>,
) => {
  const { apiValidatorRepository } = useServiceProvider();

  return useApiRepositoryQuery<GetValidatorsResponse, Error, typeof apiValidatorRepository>(
    [QUERY_KEY.getValidators, params],
    apiValidatorRepository,
    API_REPOSITORY_KEY.VALIDATOR_REPOSITORY,
    repository => repository!.getValidators(params),
    options,
  );
};
