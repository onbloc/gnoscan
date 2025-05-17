export interface TokenMeta {
  tokenType: "Native" | "GRC20";
  path: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string | null;
}

export interface GetTokenMetaByPathResponse {
  data: TokenMeta;
}
