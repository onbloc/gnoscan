/** gnoswap price fields of the token APIs; all null for a token gnoswap does not price. */
export interface TokenPriceModel {
  /** USD price of one whole token. */
  price?: string | null;
  /** USD price 24 hours earlier. */
  oneDayAgoPrice?: string | null;
  /** Percent change from oneDayAgoPrice to price. */
  changeRateOneDay?: number | null;
}

export interface TokenModel extends TokenPriceModel {
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
  /** Transaction the token was created in (its NewToken event), omitted when it is not indexed. */
  createdTransactionHash?: string;
}
