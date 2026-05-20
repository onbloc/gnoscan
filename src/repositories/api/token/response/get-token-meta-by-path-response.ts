export interface TokenMeta {
  tokenType: "Native" | "GRC20";
  tokenId: string;
  slug: string;
  path: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string | null;
}

export interface GetTokenMetaByPathResponse {
  data: TokenMeta;
}
