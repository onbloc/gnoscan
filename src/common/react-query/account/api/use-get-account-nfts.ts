import { UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryInfiniteQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { AccountNftPage, fetchAccountNftPage } from "@/common/utils/account-nft.utility";

interface UseGetAccountNftsParams {
  address: string;
  // Collections to page through, in display order
  collectionTokenIds: string[];
  // NFTs in the first page
  firstPageSize: number;
  // NFTs in every following page
  pageSize: number;
}

export const useGetAccountNfts = (
  { address, collectionTokenIds, firstPageSize, pageSize }: UseGetAccountNftsParams,
  options?: UseInfiniteQueryOptions<AccountNftPage, Error, AccountNftPage>,
): UseInfiniteQueryResult<AccountNftPage, Error> => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryInfiniteQuery<AccountNftPage, Error, typeof apiAccountRepository>(
    [QUERY_KEY.getAccountNfts, address, collectionTokenIds, firstPageSize, pageSize],
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    (repository, cursor) =>
      fetchAccountNftPage(
        collectionTokenIds,
        cursor,
        cursor ? pageSize : firstPageSize,
        (tokenId, collectionCursor, collectionLimit) =>
          repository!.getAccountGRC721CollectionItems({
            address,
            tokenId,
            cursor: collectionCursor,
            limit: collectionLimit,
          }),
      ),
    {
      ...options,
      enabled: !!address && collectionTokenIds.length > 0 && options?.enabled !== false,
    },
  );
};
