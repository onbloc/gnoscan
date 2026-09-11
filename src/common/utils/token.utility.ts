import BigNumber from "bignumber.js";
import { isBech32Address } from "./bech32.utility";
import { GNO_NETWORK_PREFIXES } from "../values/gno.constant";

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
