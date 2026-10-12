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
}

export interface GetAccountGRC721CollectionItemsResponse {
  items: AccountGRC721CollectionItemModel[];
  page: {
    cursor?: string;
    hasNext: boolean;
  };
}
