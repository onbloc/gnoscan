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
  /** grc20reg register event path. Omitted for tokens that were never registered (backfilled ones such as xGNS). */
  registeredPackagePath?: string;
  /** Distinct transactions touching the token in the last 24 hours (Transfer, Mint, Burn and Approval events). */
  transactionCount24h?: number;
}
