import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetValidatorByAddressResponse } from "@/repositories/api/validator/response";

export const useGetValidatorByAddress = (
  address: string,
  options?: UseQueryOptions<GetValidatorByAddressResponse, Error, GetValidatorByAddressResponse>,
) => {
  const { apiValidatorRepository } = useServiceProvider();

  return useApiRepositoryQuery<GetValidatorByAddressResponse, Error, typeof apiValidatorRepository>(
    [QUERY_KEY.getValidatorByAddress, address],
    apiValidatorRepository,
    API_REPOSITORY_KEY.VALIDATOR_REPOSITORY,
    repository => repository!.getValidatorByAddress(address),
    {
      enabled: !!address,
      retry: false,
      ...options,
    },
  );
};
