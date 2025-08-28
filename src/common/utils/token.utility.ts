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
