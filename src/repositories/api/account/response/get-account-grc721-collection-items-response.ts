import type { NftPositionModel } from "../../token/response/get-nft-collection-response";

export interface AccountGRC721CollectionItemModel {
  tokenId: string;
  packagePath: string;
  nftId: string;
  name: string;
  symbol: string;
  ownerAddress: string;
  // Empty when the NFT has no operator
  operatorAddress: string;
  isOwned: boolean;
  // GNFT position state; omitted for other collections.
  position?: NftPositionModel;
}

export interface GetAccountGRC721CollectionItemsResponse {
  items: AccountGRC721CollectionItemModel[];
  page: {
    totalCount?: number;
    hasNext: boolean;
  };
}
