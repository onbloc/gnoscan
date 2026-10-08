import BigNumber from "bignumber.js";

import { AssetPriceModel } from "@/repositories/api/price/response";
import { WUGNOT_PACKAGE_PATH } from "../values/constant-value";
import { findByTokenKey, parseTokenKey } from "./token.utility";

// Market data feed slug for GNOT (CoinMarketCap).
export const GNOT_FEED_ASSET_ID = "gno-land";

const GNOT_DENOM = "ugnot";
const GNOSWAP_PROVIDER = "gnoswap";
const USD_FORMAT: BigNumber.Format = { decimalSeparator: ".", groupSeparator: ",", groupSize: 3 };

export interface TokenPriceEntry {
  // USD decimal string.
  price: string;
  // {packagePath}.{symbol}; lets a package-path key reject a different token from the same package.
  tokenPath?: string;
}

/** Keyed by token path and bare package path (gnoswap), "ugnot", or feed slug. */
export type TokenPriceMap = Record<string, TokenPriceEntry>;

const isPriced = (item: AssetPriceModel): boolean => {
  if (item.status === "unavailable") return false;
  const price = new BigNumber(item.price);
  return price.isFinite() && !price.isNegative();
};

/**
 * Builds a lookup from the /prices list. gnoswap entries are keyed by token path and by bare
 * package path, so keys with or without a symbol/tokenId suffix both resolve; the first priced
 * entry per key wins. GNOT resolves from the feed first, then gnoswap's ugnot, then wugnot (1:1 wrapped).
 */
export function buildTokenPriceMap(items: AssetPriceModel[] | null | undefined): TokenPriceMap {
  const priceMap: TokenPriceMap = {};
  const setIfAbsent = (key: string, entry: TokenPriceEntry) => {
    if (!(key in priceMap)) priceMap[key] = entry;
  };

  (items ?? []).filter(isPriced).forEach(item => {
    if (item.provider !== GNOSWAP_PROVIDER) {
      setIfAbsent(item.assetId, { price: item.price });
      return;
    }
    const { packagePath, tokenPath } = parseTokenKey(item.assetId);
    const entry = { price: item.price, tokenPath };
    setIfAbsent(tokenPath, entry);
    setIfAbsent(packagePath, entry);
  });

  const gnotEntry = priceMap[GNOT_FEED_ASSET_ID] ?? priceMap[GNOT_DENOM] ?? priceMap[WUGNOT_PACKAGE_PATH];
  if (gnotEntry) priceMap[GNOT_DENOM] = { price: gnotEntry.price };

  return priceMap;
}

/**
 * USD price of a token key (denom, package path, token path, or tokenId), or null when unpriced.
 * A key naming a symbol never takes the price of a different token in the same package.
 */
export function getTokenPrice(priceMap: TokenPriceMap, tokenKey: string): string | null {
  const key = tokenKey.trim();
  if (key.toLowerCase() === GNOT_DENOM) return priceMap[GNOT_DENOM]?.price ?? null;
  return findByTokenKey(priceMap, key)?.price ?? null;
}

/** amount (display units, decimals applied) x price. Null when either side is not a finite number. */
export function getUsdValue(amount: BigNumber.Value, price: BigNumber.Value): BigNumber | null {
  const value = new BigNumber(typeof amount === "string" ? amount.replace(/,/g, "") : amount).multipliedBy(price);
  return value.isFinite() ? value : null;
}

// Decimal places shown below $1 and from $1 up; both truncate (round down).
const USD_DECIMALS_BELOW_ONE = 3;
const USD_DECIMALS_FROM_ONE = 2;
const MIN_DISPLAY_USD = new BigNumber("0.001");
// Non-breaking space keeps "<" and the amount on one line when the text wraps.
const BELOW_MIN_DISPLAY_USD = "<\u00A0$0.001";

/**
 * Truncates (never rounds up) and drops trailing zeros: below $1 keeps three decimals
 * ("$0.012", "$0.5"), from $1 up keeps two decimals with thousands separators ("$1,234.56", "$1").
 * Values above zero but below $0.001 render as "< $0.001" instead of a long fraction.
 * Values are never negative (prices and amounts are non-negative), so no sign handling.
 */
export function formatUsd(value: BigNumber.Value | null | undefined): string | null {
  if (value === null || value === undefined) return null;

  const usd = new BigNumber(value);
  if (!usd.isFinite()) return null;
  if (usd.gt(0) && usd.lt(MIN_DISPLAY_USD)) return BELOW_MIN_DISPLAY_USD;

  const decimals = usd.lt(1) ? USD_DECIMALS_BELOW_ONE : USD_DECIMALS_FROM_ONE;
  return `$${usd.decimalPlaces(decimals, BigNumber.ROUND_DOWN).toFormat(USD_FORMAT)}`;
}

/** Formatted USD value of a token amount, or null when the token has no price. */
export function formatTokenUsd(priceMap: TokenPriceMap, tokenKey: string, amount: BigNumber.Value): string | null {
  const price = getTokenPrice(priceMap, tokenKey);
  return price === null ? null : formatUsd(getUsdValue(amount, price));
}
