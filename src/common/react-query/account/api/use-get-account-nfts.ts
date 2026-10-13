import { UseQueryOptions } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { AccountNftPage, fetchAccountNftPage } from "@/common/utils/account-nft.utility";
import { AccountGRC721CollectionModel } from "@/repositories/api/account/response";

interface UseGetAccountNftsParams {
  address: string;
  collections: Pick<AccountGRC721CollectionModel, "tokenId" | "tokenCount">[];
  page: number;
  pageSize: number;
}

export const useGetAccountNfts = (
  { address, collections, page, pageSize }: UseGetAccountNftsParams,
  options?: UseQueryOptions<AccountNftPage, Error, AccountNftPage>,
) => {
  const { apiAccountRepository } = useServiceProvider();

  return useApiRepositoryQuery(
    [QUERY_KEY.getAccountNfts, address, collections, page, pageSize],
    apiAccountRepository,
    API_REPOSITORY_KEY.ACCOUNT_REPOSITORY,
    repository =>
      fetchAccountNftPage(collections, page, pageSize, (tokenId, collectionPage, limit) =>
        repository.getAccountGRC721CollectionItems({ address, tokenId, page: collectionPage, limit }),
      ),
    { ...options, enabled: !!address && collections.length > 0 && options?.enabled !== false },
  );
};
