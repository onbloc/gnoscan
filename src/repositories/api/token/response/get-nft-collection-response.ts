import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface NftCollectionModel {
  tokenId: string;
  name: string;
  symbol: string;
  path: string;
  totalSupply: string;
  // Realm publisher
  owner: string;
  ownerLabel?: string | null;
  ownerLabelType?: ADDRESS_LABEL_TYPE | null;
  holders: number;
  // Mint, transfer and burn logs
  transfers: number;
}

export interface GetNftCollectionsResponse {
  items: NftCollectionModel[];
  page: {
    cursor?: string;
    hasNext: boolean;
  };
}

export interface GetNftCollectionResponse {
  data: {
    tokenId: string;
    name: string;
    symbol: string;
    path: string;
    totalSupply: string;
    owner: string;
    ownerName: string;
    ownerLabel?: string | null;
    ownerLabelType?: ADDRESS_LABEL_TYPE | null;
    funcTypesList: string[];
    sourceFiles: { filename: string; content: string }[];
    holders: number;
  };
}

export interface NftCollectionItemModel {
  tokenId: string;
  packagePath: string;
  nftId: string;
  ownerAddress: string;
  ownerNameTag?: string;
  ownerLabel?: string | null;
  ownerLabelType?: ADDRESS_LABEL_TYPE | null;
  // gnoswap position operator; empty when none
  operatorAddress: string;
}

export interface GetNftCollectionItemsResponse {
  items: NftCollectionItemModel[];
  page: {
    cursor?: string;
    hasNext: boolean;
    // Live NFT count, first page only
    totalCount?: number;
  };
}

export type NftTokenLookupStatus = "found" | "not_set" | "unsupported" | "unavailable";

export interface NftTokenUriModel {
  tokenId: string;
  uri: string;
  status: NftTokenLookupStatus;
  needsRefetch: boolean;
}

export interface GetNftTokenUrisResponse {
  items: NftTokenUriModel[];
}

export interface GetNftTokenDetailResponse {
  tokenId: string;
  uri: string;
  status: NftTokenLookupStatus;
  metadataStatus: NftTokenLookupStatus;
  uriNeedsRefetch: boolean;
  metadataNeedsRefetch: boolean;
  metadata?: {
    image?: string;
    imageData?: string;
    name?: string;
    description?: string;
    attributes?: { traitType: string; value: string; displayType?: string }[];
    externalUrl?: string;
    backgroundColor?: string;
    animationUrl?: string;
    youtubeUrl?: string;
  } | null;
}
