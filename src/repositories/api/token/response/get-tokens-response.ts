import { TokenModel } from "@/models/api/token/token-model";

export interface GetTokensResponse {
  items: TokenModel[];
  page: {
    cursor: string;
    hasNext: boolean;
  };
}
