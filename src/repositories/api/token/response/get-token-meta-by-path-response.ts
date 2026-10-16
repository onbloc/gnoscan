export interface TokenMeta {
  tokenType: "Native" | "GRC20" | "GRC721";
  tokenId: string;
  slug: string;
  path: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string | null;
  realmAddress: string;
  hostedTokenCount: number;
}

export interface GetTokenMetaByPathResponse {
  data: TokenMeta;
}
