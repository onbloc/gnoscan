import { useQuery, UseQueryOptions } from "react-query";
import { CommonError } from "@/common/errors";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

export function useApiRepositoryQuery<TData, TError = Error, TRepository = unknown>(
  queryKey: unknown[],
  repository: TRepository | null,
  repositoryName: API_REPOSITORY_KEY,
  queryFn: (repo: TRepository) => Promise<TData>,
  options?: UseQueryOptions<TData, TError, TData>,
) {
  const { currentNetwork } = useNetworkProvider();

  const networkAwareQueryKey = [currentNetwork?.chainId || "", ...queryKey];

  return useQuery({
    queryKey: networkAwareQueryKey,
    queryFn: () => {
      if (!repository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", repositoryName);
      }
      return queryFn(repository);
    },
    enabled: !!repository && options?.enabled !== false,
    ...options,
  });
}
