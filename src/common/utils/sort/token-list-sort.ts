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
 * Translates the UI sort option into API request params. Only holders sorts on the server; the
 * other columns sort on the client (see {@link sortTokensOnClient}), so they request the default order.
 */
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

const CLIENT_SORT_FIELDS: TokenListSortOption["field"][] = ["marketCap", "totalSupply", "transfers24h"];

/** Columns the API cannot sort yet (market cap, total supply, transfers); they sort on the loaded rows. */
export const isClientSortField = (sortOption: TokenListSortOption) =>
  sortOption.order !== "none" && CLIENT_SORT_FIELDS.includes(sortOption.field);

/** Sorts loaded tokens by a client side column. Tokens without a value (no price or count) always go last. */
export const sortTokensOnClient = (
  tokens: GRC20InfoWithLogo[],
  sortOption: TokenListSortOption,
): GRC20InfoWithLogo[] => {
  if (!isClientSortField(sortOption)) return tokens;

  const valueOf = (token: GRC20InfoWithLogo): BigNumber | null => {
    if (sortOption.field === "marketCap") return getTokenMarketCap(token);
    if (sortOption.field === "transfers24h") {
      return token.transactionCount24h === null ? null : new BigNumber(token.transactionCount24h);
    }
    return new BigNumber(formatTokenDecimal(token.totalSupply, token.decimals));
  };
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
