import BigNumber from "bignumber.js";
import { GNOTToken } from "../hooks/common/use-token-meta";
import { Amount } from "@/types/data-type";

type TokenValue = string | number;
type TokenDenom = string;

/**
 * Convert given values and units to GNOT units
 * @param value Value to convert
 * @param denom Denom to convert
 * @returns Interface: Amount
 */
export const toGNOT = (value: TokenValue, denom: TokenDenom): Amount => {
  return {
    value: convertAmountValue(value, denom),
    denom: convertAmountDenom(denom),
  };
};

export const convertAmountValue = (value: TokenValue, denom: TokenDenom): string => {
  if (!value) return "0";

  return isUgnot(denom)
    ? new BigNumber(value).shiftedBy(-GNOTToken.decimals).toString()
    : new BigNumber(value).toString();
};

export const convertAmountDenom = (denom: TokenDenom): string => {
  return isUgnot(denom) ? GNOTToken.symbol : denom.toUpperCase().trim();
};

export const isUgnot = (denom: TokenDenom): boolean => {
  const normalizeDenom = denom.toLowerCase().trim();
  return normalizeDenom === GNOTToken.denom;
};
