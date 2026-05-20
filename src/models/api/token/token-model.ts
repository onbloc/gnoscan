export interface TokenModel {
  tokenId: string;
  slug: string;
  name: string;
  symbol: string;
  owner: string;
  holders: number;
  funcTypesList: string[];
  decimals: number;
  totalSupply: string;
  path: string;
  logoUrl: string | null;
}
