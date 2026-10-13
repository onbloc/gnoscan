import React from "react";
import { UseInfiniteQueryOptions, UseInfiniteQueryResult, UseQueryOptions, useQueryClient } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useApiRepositoryInfiniteQuery, useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetNftCollectionItemsRequest, GetNftCollectionsRequest } from "@/repositories/api/token/request";
import {
  GetNftCollectionItemsResponse,
  GetNftCollectionResponse,
  GetNftCollectionsResponse,
  GetNftTokenDetailResponse,
} from "@/repositories/api/token/response";

export const useGetNftCollection = (
  tokenKey: string,
  options?: UseQueryOptions<GetNftCollectionResponse, Error, GetNftCollectionResponse>,
) => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getNftCollection, tokenKey],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    repository => repository.getNftCollection(tokenKey),
    { ...options, enabled: !!tokenKey && options?.enabled !== false },
  );
};

// One page of the collection list; used for list-only fields such as the transfer count.
export const useGetNftCollections = (
  params: GetNftCollectionsRequest,
  options?: UseQueryOptions<GetNftCollectionsResponse, Error, GetNftCollectionsResponse>,
) => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getNftCollections, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    repository => repository.getNftCollections(params),
    options,
  );
};

// Cursor-paginated (infinite scroll) collection list for the NFT collections page.
export const useGetNftCollectionsInfinite = (
  params: GetNftCollectionsRequest = {},
  options?: UseInfiniteQueryOptions<GetNftCollectionsResponse, Error, GetNftCollectionsResponse>,
): UseInfiniteQueryResult<GetNftCollectionsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetNftCollectionsResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getNftCollectionsList, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, cursor) => repository!.getNftCollections({ ...params, cursor }),
    options,
  );
};

export const useGetNftCollectionItems = (
  params: GetNftCollectionItemsRequest,
  options?: UseQueryOptions<GetNftCollectionItemsResponse, Error, GetNftCollectionItemsResponse>,
) => {
  const { apiTokenRepository } = useServiceProvider();
  const request = { ...params, page: params.page ?? 1 };

  return useApiRepositoryQuery(
    [QUERY_KEY.getNftCollectionItems, request],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    repository => repository.getNftCollectionItems(request),
    { ...options, enabled: !!params.tokenKey && options?.enabled !== false },
  );
};

export const useGetNftCollectionItemsInfinite = (
  params: GetNftCollectionItemsRequest,
  options?: UseInfiniteQueryOptions<GetNftCollectionItemsResponse, Error, GetNftCollectionItemsResponse>,
): UseInfiniteQueryResult<GetNftCollectionItemsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetNftCollectionItemsResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getNftCollectionItems, "all", params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    async (repository, cursor) => {
      const page = cursor === undefined ? params.page ?? 1 : Number(cursor);
      const response = await repository!.getNftCollectionItems({ ...params, page });
      return {
        ...response,
        // The items API uses page numbers; only the infinite-query HOC needs a cursor.
        page: { ...response.page, cursor: response.page.hasNext ? String(page + 1) : undefined },
      };
    },
    { ...options, enabled: !!params.tokenKey && options?.enabled !== false },
  );
};

export const useGetNftTokenDetail = (packagePath: string, nftId: string) => {
  const { apiTokenRepository } = useServiceProvider();

  const { currentNetwork } = useNetworkProvider();
  const queryClient = useQueryClient();
  const queryKey = React.useMemo(
    () => [currentNetwork?.chainId || "", QUERY_KEY.getNftTokenDetail, packagePath, nftId],
    [currentNetwork?.chainId, packagePath, nftId],
  );
  const query = useApiRepositoryQuery(
    [QUERY_KEY.getNftTokenDetail, packagePath, nftId],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    repository => repository.getNftTokenDetail(packagePath, nftId),
    { enabled: !!packagePath && !!nftId },
  );
  const attempted = React.useRef(new WeakSet<GetNftTokenDetailResponse>());
  const data = query.data;
  React.useEffect(() => {
    if (!apiTokenRepository || !data || attempted.current.has(data)) return;
    if (!data.uriNeedsRefetch && !data.metadataNeedsRefetch) return;
    attempted.current.add(data);
    let cancelled = false;
    // Display stale/partial values first; refresh the flagged lookup without clearing them.
    void apiTokenRepository
      .getNftTokenDetail(packagePath, nftId, true)
      .then(detail => {
        if (cancelled) return;
        queryClient.setQueryData(queryKey, detail);
        const cached = queryClient.getQueryData<GetNftTokenDetailResponse>(queryKey);
        if (cached) attempted.current.add(cached);
      })
      .catch(() => {
        // Keep usable stale data and its refetch warning if the refresh fails.
      });
    return () => {
      cancelled = true;
    };
  }, [apiTokenRepository, data, packagePath, nftId, queryClient, queryKey]);
  return query;
};
