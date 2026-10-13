import { UseInfiniteQueryOptions, UseInfiniteQueryResult, UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryInfiniteQuery, useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { GetNftCollectionItemsRequest, GetNftCollectionsRequest } from "@/repositories/api/token/request";
import {
  GetNftCollectionItemsResponse,
  GetNftCollectionResponse,
  GetNftCollectionsResponse,
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
  options?: UseInfiniteQueryOptions<GetNftCollectionItemsResponse, Error, GetNftCollectionItemsResponse>,
): UseInfiniteQueryResult<GetNftCollectionItemsResponse, Error> => {
  const { apiTokenRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<GetNftCollectionItemsResponse, Error, typeof apiTokenRepository>(
    [QUERY_KEY.getNftCollectionItems, params],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    (repository, cursor) => repository!.getNftCollectionItems({ ...params, cursor }),
    { ...options, enabled: !!params.tokenKey && options?.enabled !== false },
  );
};
