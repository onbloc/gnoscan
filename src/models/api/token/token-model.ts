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
  /** "Y" once grc20reg emitted the token's register event. */
  isRegYn: "Y" | "N";
  /** Distinct transactions touching the token in the last 24 hours (Transfer, Mint, Burn and Approval events). */
  transactionCount24h?: number;
  /** RFC3339 block time the token was created. */
  createdAt?: string;
}
