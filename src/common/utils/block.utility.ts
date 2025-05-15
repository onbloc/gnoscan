import { GNO_BLOCK_CONSTANTS } from "../values/gno.constant";

export const formatDisplayBlockHeight = (height: number | string | undefined | null): string => {
  if (height == null) return "-";

  const stringHeight = String(height).trim();

  if (!stringHeight || isNaN(Number(stringHeight))) return "-";

  if (stringHeight === "0") return GNO_BLOCK_CONSTANTS.GENESIS;

  return height.toString();
};
