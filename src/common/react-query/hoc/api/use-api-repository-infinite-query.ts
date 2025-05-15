import { useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";
import { CommonError } from "@/common/errors";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

/**
 * Higher-order functions for safe infinite-scroll queries
 *
 * Unified management of repository presence checks, network change detection, and error handling.
 *
 * @param queryKey - query key array
 * @param repository - API repository instance
 * @param repositoryName - repository identifier
 * @param queryFn - function to fetch the actual data
 * @param options - react-query options
 */
export function useApiRepositoryInfiniteQuery<TData, TError = Error, TRepository = unknown>(
  queryKey: unknown[],
  repository: TRepository | null,
  repositoryName: API_REPOSITORY_KEY,
  queryFn: (repo: TRepository, pageParam: unknown) => Promise<TData>,
  options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">,
): UseInfiniteQueryResult<TData, TError> {
  const { currentNetwork } = useNetworkProvider();

  const networkAwareQueryKey = [currentNetwork?.chainId || "", ...queryKey];

  return useInfiniteQuery<TData, TError>({
    queryKey: networkAwareQueryKey,
    queryFn: ({ pageParam }) => {
      if (!repository) {
        throw new CommonError("FAILED_INITIALIZE_REPOSITORY", repositoryName);
      }
      return queryFn(repository, pageParam);
    },
    enabled: !!repository && options?.enabled !== false,
    ...options,
  });
}
