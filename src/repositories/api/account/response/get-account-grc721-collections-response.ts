export interface AccountGRC721CollectionModel {
  tokenId: string;
  packagePath: string;
  name: string;
  symbol: string;
  // NFTs the account owns or operates in the collection
  tokenCount: number;
  ownedCount: number;
}

export interface GetAccountGRC721CollectionsResponse {
  items: AccountGRC721CollectionModel[];
}
