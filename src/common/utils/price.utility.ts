import BigNumber from "bignumber.js";

import { AssetPriceModel } from "@/repositories/api/price/response";
import { WUGNOT_PACKAGE_PATH } from "../values/constant-value";
import { toBarePackagePath } from "./token.utility";

// Market data feed slug for GNOT (CoinMarketCap).
export const GNOT_FEED_ASSET_ID = "gno-land";

const GNOT_DENOM = "ugnot";
const GNOSWAP_PROVIDER = "gnoswap";
const USD_FORMAT: BigNumber.Format = { decimalSeparator: ".", groupSeparator: ",", groupSize: 3 };

/** Price (USD decimal string) keyed by bare package path, "ugnot", or feed slug. */
export type TokenPriceMap = Record<string, string>;

const isPriced = (item: AssetPriceModel): boolean => {
  if (item.status === "unavailable") return false;
  const price = new BigNumber(item.price);
  return price.isFinite() && !price.isNegative();
};

/**
 * Builds a lookup from the /prices list. gnoswap token paths are reduced to bare package paths
 * to match gnoscan token keys; the first priced entry per key wins.
 * GNOT resolves from the feed first, then gnoswap's ugnot, then wugnot (1:1 wrapped).
 */
export function buildTokenPriceMap(items: AssetPriceModel[] | null | undefined): TokenPriceMap {
  const priceMap: TokenPriceMap = {};

  (items ?? []).filter(isPriced).forEach(item => {
    const key = item.provider === GNOSWAP_PROVIDER ? toBarePackagePath(item.assetId) : item.assetId;
    if (!(key in priceMap)) priceMap[key] = item.price;
  });

  const gnotPrice = priceMap[GNOT_FEED_ASSET_ID] ?? priceMap[GNOT_DENOM] ?? priceMap[WUGNOT_PACKAGE_PATH];
  if (gnotPrice) priceMap[GNOT_DENOM] = gnotPrice;

  return priceMap;
}

/** USD price of a token key (denom, package path, or token path), or null when unpriced. */
export function getTokenPrice(priceMap: TokenPriceMap, tokenKey: string): string | null {
  if (!tokenKey) return null;
  const key = tokenKey.trim();
  return priceMap[key.toLowerCase() === GNOT_DENOM ? GNOT_DENOM : toBarePackagePath(key)] ?? null;
}

/** amount (display units, decimals applied) x price. Null when either side is not a finite number. */
export function getUsdValue(amount: BigNumber.Value, price: BigNumber.Value): BigNumber | null {
  const value = new BigNumber(typeof amount === "string" ? amount.replace(/,/g, "") : amount).multipliedBy(price);
  return value.isFinite() ? value : null;
}

/** "$1,234.56": up to 2 decimals, rounded down, trailing zeros trimmed ("$1", "$1.1", sub-cent -> "$0"). */
export function formatUsd(value: BigNumber.Value | null | undefined): string | null {
  if (value === null || value === undefined) return null;

  const usd = new BigNumber(value);
  if (!usd.isFinite()) return null;

  // lt(0) rather than isNegative() so a truncated -0 renders as "$0".
  const truncated = usd.decimalPlaces(2, BigNumber.ROUND_DOWN);
  const sign = truncated.lt(0) ? "-" : "";

  return `${sign}$${truncated.abs().toFormat(USD_FORMAT)}`;
}

/** Formatted USD value of a token amount, or null when the token has no price. */
export function formatTokenUsd(priceMap: TokenPriceMap, tokenKey: string, amount: BigNumber.Value): string | null {
  const price = getTokenPrice(priceMap, tokenKey);
  return price === null ? null : formatUsd(getUsdValue(amount, price));
}
