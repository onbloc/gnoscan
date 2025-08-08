import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { CommonError } from "@/common/errors";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { API_REPOSITORY_KEY, RPC_REPOSITORY_KEY } from "@/common/values/query.constant";

/**
 * Higher-order functions for safe queries
 *
 * Unified management of repository presence checks, network change detection, and error handling.
 *
 * @param queryKey - query key array
 * @param repository - API repository instance
 * @param repositoryName - repository identifier
 * @param queryFn - function to fetch the actual data
 * @param options - react-query options
 */
export function useApiRepositoryQuery<TData, TError = Error, TRepository = unknown>(
  queryKey: unknown[],
  repository: TRepository | null,
  repositoryName: API_REPOSITORY_KEY | RPC_REPOSITORY_KEY,
  queryFn: (repository: TRepository) => Promise<TData>,
  options?: UseQueryOptions<TData, TError, TData>,
): UseQueryResult<TData, TError> {
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
