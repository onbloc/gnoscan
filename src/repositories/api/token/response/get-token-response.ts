import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface GetTokenResponse {
  data: {
    tokenId: string;
    slug: string;
    name: string;
    symbol: string;
    totalSupply: string;
    decimals: number;
    path: string;
    funcTypesList: string[];
    owner: string;
    ownerName: string;
    ownerLabel?: string | null;
    ownerLabelType?: ADDRESS_LABEL_TYPE | null;
    holders: number;
    sourceFiles: [
      {
        content: string;
        filename: string;
      },
    ];
  };
  page: string;
}
