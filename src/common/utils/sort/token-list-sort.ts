import BigNumber from "bignumber.js";

import { TokenListSortOption } from "@/common/types/token";
import { GRC20InfoWithLogo } from "@/common/mapper/token/token-mapper";
import { GetTokensRequestParameters } from "@/repositories/api/token/request";
import { getUsdValue, TokenPriceEntry } from "../price.utility";
import { formatTokenDecimal } from "../token.utility";

type PriceEntryLookup = (tokenKey: string) => TokenPriceEntry | null;

export const toTokenKey = (token: GRC20InfoWithLogo) =>
  token.symbol ? `${token.packagePath}.${token.symbol}` : token.packagePath;

/** Price times total supply in display units, or null when the token has no price. */
export const getTokenMarketCap = (token: GRC20InfoWithLogo, getPriceEntry: PriceEntryLookup): BigNumber | null => {
  const price = getPriceEntry(toTokenKey(token))?.price;
  return price ? getUsdValue(formatTokenDecimal(token.totalSupply, token.decimals), price) : null;
};

// Translates the UI sort option into API request params. Only holders sorts on the server; the
// other columns sort on the client (see sortTokensOnClient), so they request the default order.
export const toTokenListApiSortParams = (
  sortOption: TokenListSortOption,
): Pick<GetTokensRequestParameters, "sort" | "order"> => {
  if (sortOption.field !== "holders" || sortOption.order === "none") {
    return {};
  }

  return {
    sort: sortOption.field,
    order: sortOption.order,
  };
};

/** Columns the API cannot sort: market cap comes from the price feed, which the API does not store. */
export const isClientSortField = (sortOption: TokenListSortOption) =>
  sortOption.order !== "none" && (sortOption.field === "marketCap" || sortOption.field === "totalSupply");

/** Sorts loaded tokens by a client side column. Tokens without a value (no price) always go last. */
export const sortTokensOnClient = (
  tokens: GRC20InfoWithLogo[],
  sortOption: TokenListSortOption,
  getPriceEntry: PriceEntryLookup,
): GRC20InfoWithLogo[] => {
  if (!isClientSortField(sortOption)) return tokens;

  const valueOf = (token: GRC20InfoWithLogo) =>
    sortOption.field === "marketCap"
      ? getTokenMarketCap(token, getPriceEntry)
      : new BigNumber(formatTokenDecimal(token.totalSupply, token.decimals));
  const direction = sortOption.order === "asc" ? 1 : -1;

  return tokens
    .map(token => ({ token, value: valueOf(token) }))
    .sort((a, b) => {
      if (!a.value) return b.value ? 1 : 0;
      if (!b.value) return -1;
      return a.value.comparedTo(b.value) * direction;
    })
    .map(({ token }) => token);
};
