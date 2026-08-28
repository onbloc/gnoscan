import { TokenHolderModel } from "@/models/api/token/token-holder-model";

export interface GetTokenHoldersResponse {
  items: TokenHolderModel[];
  page: {
    cursor: string;
    hasNext: boolean;
    totalCount: number;
  };
}
