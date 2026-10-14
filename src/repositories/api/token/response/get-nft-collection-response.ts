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
    // Creation-event emitter, not a certification of standards compliance.
    standardPackage: string | null;
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

export interface GetNftItemDetailResponse {
  data: {
    tokenId: string;
    nftId: string;
    // Caller of the latest mint, including remints; not necessarily the recipient.
    mintedBy: string | null;
    lastMintBlockHeight: number | null;
    lastMintTransactionHash: string | null;
    // RFC3339 time of the latest successful indexed mint, including remints.
    lastMintBlockTime: string | null;
    // Transfers only; excludes mint and burn.
    lastTransferBlockTime: string | null;
    // Unknown means no indexed evidence, not unsupported or zero royalty.
    royaltyStatus: "found" | "not_set" | "unknown";
    royalty: {
      receiver: string;
      // Basis points (10000 = 100%); zero with a receiver is a valid policy.
      bps: number;
      scope: "default" | "token";
    } | null;
  };
}

export interface NftItemTransferModel {
  // Empty fromAddress denotes a mint; empty toAddress denotes a burn.
  fromAddress: string;
  toAddress: string;
  callerAddress: string;
  transactionHash: string;
  blockHeight: number;
  blockTime: string;
}

export interface GetNftItemTransfersResponse {
  items: NftItemTransferModel[];
  page: {
    hasNext: boolean;
    totalCount: number;
  };
}

export type NftTokenLookupStatus = "found" | "not_set" | "unsupported" | "unavailable";

export interface NftTokenUriModel {
  tokenId: string;
  uri: string;
  // Image extracted from an inline JSON TokenURI; the raw URI is omitted in that case
  image?: string;
  status: NftTokenLookupStatus;
  needsRefetch: boolean;
}

export interface GetNftTokenUrisResponse {
  items: NftTokenUriModel[];
}

export interface GetNftTokenDetailResponse {
  tokenId: string;
  uri: string;
  // Resolved metadata image, or the decoded inline TokenURI image
  image?: string;
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
