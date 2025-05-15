import { GNO_BLOCK_CONSTANTS } from "../values/gno.constant";

export const formatDisplayBlockHeight = (height: number | string | undefined | null): string => {
  if (height == 0) return GNO_BLOCK_CONSTANTS.GENESIS;
  if (height == null) return "-";

  return height.toString();
};
