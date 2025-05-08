import { useQuery, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { GetAccountResponse } from "@/repositories/api/account/response";
import { CommonError } from "@/common/errors";

export const useGetAccountByAddress = (
  address: string,
  options?: UseQueryOptions<GetAccountResponse, Error, GetAccountResponse>,
) => {
  const { apiAccountRepository } = useServiceProvider();

  return useQuery({
    queryKey: [QUERY_KEY.getAccount, address],
    queryFn: () => {
      if (!apiAccountRepository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", "ApiAccountRepository");
      }

      return apiAccountRepository.getAccount(address);
    },
    ...options,
  });
};
