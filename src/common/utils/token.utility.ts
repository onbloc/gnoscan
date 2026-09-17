import BigNumber from "bignumber.js";
import { isBech32Address } from "./bech32.utility";
import { GNO_NETWORK_PREFIXES } from "../values/gno.constant";
import { WUGNOT_PACKAGE_PATH, WUGNOT_DISPLAY_DECIMALS } from "../values/constant-value";

export function parseTokenAmount(tokenAmount = "0", denomination = "ugnot"): number {
  const pattern = new RegExp(`^(\\d+)${denomination}$`);
  const match = tokenAmount.match(pattern);

  return match ? parseInt(match[1], 10) : 0;
}

export function formatTokenDecimal(amount: string | number, decimals: number): string {
  const amountToBigNumber = new BigNumber(amount);
  const decimalNumber = Number(decimals);

  const normalizedDecimals = !isNaN(decimalNumber) && decimalNumber > 0 ? Math.floor(decimalNumber) : 0;

  if (amountToBigNumber.isNaN() || !amountToBigNumber.isFinite()) {
    return "0";
  }

  return amountToBigNumber.shiftedBy(-normalizedDecimals).toString(10);
}

/**
 * GRC20 helper-routed transfers denominate their amount in the token's
 * registry key ({packagePath}.{symbol}) instead of the bare packagePath used
 * everywhere else (see onbloc-api-v3 IsGRC20HelperTransfer). Strip that
 * trailing ".{symbol}" so the denom matches the packagePath keys used by
 * tokenMap / the token-meta API.
 */
export function stripTokenKeySymbol(denom: string): string {
  if (!denom) return denom;

  const lastSlashIndex = denom.lastIndexOf("/");
  const lastSegment = lastSlashIndex === -1 ? denom : denom.slice(lastSlashIndex + 1);
  const dotIndex = lastSegment.lastIndexOf(".");

  if (dotIndex === -1) return denom;

  return denom.slice(0, lastSlashIndex + 1) + lastSegment.slice(0, dotIndex);
}

// Registry-keyed denoms end in ".{symbol}"; grc20 helper-routed ones tack on a further
// purely-numeric ".{7 digits}" tokenId suffix (see stripTokenKeySymbol) - drop that suffix,
// if present, or the trailing numbers themselves get mistaken for the symbol.
function stripNumericTokenIdSuffix(parts: string[]): string[] {
  return /^\d+$/.test(parts[parts.length - 1]) ? parts.slice(0, -1) : parts;
}

/**
 * Best-effort symbol parsed straight from a token key/path, for when the token-meta API has no
 * record of it at all (e.g. a token that was never registered).
 */
export function getFallbackTokenSymbol(tokenKey: string): string {
  const lastSegment = tokenKey.split("/").pop() || tokenKey;
  const parts = lastSegment.split(".");
  if (parts.length <= 1) return lastSegment;

  const withoutNumericSuffix = stripNumericTokenIdSuffix(parts);
  return withoutNumericSuffix[withoutNumericSuffix.length - 1];
}

// Same suffix-stripping as getFallbackTokenSymbol, but "" (not the raw segment) when there's
// no explicit "."-symbol - callers use that to mean "no symbol suffix to alias".
export function getTokenKeySymbol(tokenKey: string): string {
  const lastSegment = tokenKey.split("/").pop() || "";
  const parts = lastSegment.split(".");
  if (parts.length <= 1) return "";

  const withoutNumericSuffix = stripNumericTokenIdSuffix(parts);
  return withoutNumericSuffix.length <= 1 ? "" : withoutNumericSuffix[withoutNumericSuffix.length - 1];
}

// A helper-routed GRC20 denom can carry both the registry symbol and a numeric tokenId
// suffix (packagePath.symbol.tokenId) - stripTokenKeySymbol only removes one dot-suffix
// level per call, so repeat until it stabilizes to reach the bare packagePath regardless
// of how many suffixes are stacked on top.
export function toBarePackagePath(denom: string): string {
  let path = denom;
  let stripped = stripTokenKeySymbol(path);
  while (stripped !== path) {
    path = stripped;
    stripped = stripTokenKeySymbol(path);
  }
  return path;
}

export interface ResolvedTokenMeta {
  name: string;
  symbol: string;
  decimals: number;
  image?: string;
}

export type TokenMetaFallback = ResolvedTokenMeta;

export function isWugnotPackagePath(packagePath: string): boolean {
  return toBarePackagePath(packagePath) === WUGNOT_PACKAGE_PATH;
}

/**
 * The static gno-token-resource list is the first-choice source for a token's
 * name/symbol/decimals/image; the caller's own (backend/on-chain) data is only used as a
 * fallback for tokens the resource list doesn't know about. It's all-or-nothing per token -
 * fields aren't merged individually - so the result is never a mix of both sources.
 */
export function resolveTokenMeta<T extends { name: string; symbol: string; decimals: number; image?: string }>(
  tokenResourceMap: Record<string, T>,
  tokenKey: string,
  fallback: TokenMetaFallback,
): ResolvedTokenMeta {
  const resourceMeta = tokenResourceMap[tokenKey] || tokenResourceMap[toBarePackagePath(tokenKey)];
  const resolved = resourceMeta
    ? {
        name: resourceMeta.name,
        symbol: resourceMeta.symbol,
        decimals: resourceMeta.decimals,
        image: resourceMeta.image || fallback.image,
      }
    : fallback;

  // wugnot is on-chain with decimals: 0 and neither source reports it correctly, so this
  // overrides regardless of which one (resource or fallback) resolved above.
  if (isWugnotPackagePath(tokenKey)) {
    return { ...resolved, decimals: WUGNOT_DISPLAY_DECIMALS };
  }

  return resolved;
}

export function formatDisplayTokenPath(path: string, visibleLength = 8): string {
  if (!path || typeof path !== "string") return path;

  const prefix = GNO_NETWORK_PREFIXES.TOKEN_PATH;
  if (!path.startsWith(prefix)) return path;

  try {
    const [address, tokenName] = path.substring(prefix.length).split("/");

    if (!address || !tokenName) return path;

    if (!isBech32Address(address)) return path;

    const ellipsisAddress = `${address.slice(0, visibleLength)}...${address.slice(-visibleLength)}`;
    return `${prefix}${ellipsisAddress}/${tokenName}`;
  } catch {
    return path;
  }
}
