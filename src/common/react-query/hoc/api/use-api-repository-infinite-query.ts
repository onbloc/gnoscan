import { useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";
import { CommonError } from "@/common/errors";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";

/**
 * Response shape of cursor paginated API lists
 */
export interface CursorPageResponse {
  page: {
    hasNext: boolean;
    cursor?: string | null;
  };
}

/**
 * Higher-order functions for safe infinite-scroll queries
 *
 * Unified management of repository presence checks, network change detection, and error handling.
 * Pages are requested by cursor: the next cursor comes from `page.cursor` while `page.hasNext` is true.
 *
 * @param queryKey - query key array
 * @param repository - API repository instance
 * @param repositoryName - repository identifier
 * @param queryFn - function to fetch the page that starts at the given cursor
 * @param options - react-query options
 */
export function useApiRepositoryInfiniteQuery<TData extends CursorPageResponse, TError = Error, TRepository = unknown>(
  queryKey: unknown[],
  repository: TRepository | null,
  repositoryName: API_REPOSITORY_KEY,
  queryFn: (repo: TRepository, cursor: string | undefined) => Promise<TData>,
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
      return queryFn(repository, pageParam as string | undefined);
    },
    getNextPageParam: lastPage => (lastPage.page.hasNext ? lastPage.page.cursor : undefined),
    enabled: !!repository && options?.enabled !== false,
    ...options,
  });
}
