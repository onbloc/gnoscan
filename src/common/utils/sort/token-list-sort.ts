import BigNumber from "bignumber.js";

import { TokenListSortOption } from "@/common/types/token";
import { GRC20InfoWithLogo } from "@/common/mapper/token/token-mapper";
import { GetTokensRequestParameters } from "@/repositories/api/token/request";
import { getUsdValue, TokenPriceEntry } from "../price.utility";
import { formatTokenDecimal } from "../token.utility";

export const toTokenKey = (token: Pick<GRC20InfoWithLogo, "packagePath" | "symbol">) =>
  token.symbol ? `${token.packagePath}.${token.symbol}` : token.packagePath;

/** Price times total supply in display units, or null when the token has no price. */
export const getTokenMarketCap = (token: GRC20InfoWithLogo): BigNumber | null =>
  token.price ? getUsdValue(formatTokenDecimal(token.totalSupply, token.decimals), token.price) : null;

/**
 * Overlays the polled /prices entry (price and 24h change together) onto each token. A token without
 * an entry keeps the price the token API returned.
 */
export const applyLivePrices = (
  tokens: GRC20InfoWithLogo[],
  getPriceEntry: (tokenKey: string) => TokenPriceEntry | null,
): GRC20InfoWithLogo[] =>
  tokens.map(token => {
    const entry = getPriceEntry(toTokenKey(token));
    return entry ? { ...token, price: entry.price, changeRateOneDay: entry.changeRateOneDay ?? null } : token;
  });

/**
 * Translates the UI sort option into API request params. Every column sorts on the server over the full token set.
 * Returns no sort/order when unsorted so the server falls back to its default.
 */
export const toTokenListApiSortParams = (
  sortOption: TokenListSortOption,
): Pick<GetTokensRequestParameters, "sort" | "order"> => {
  if (sortOption.field === "none" || sortOption.order === "none") {
    return {};
  }

  return {
    sort: sortOption.field,
    order: sortOption.order,
  };
};
