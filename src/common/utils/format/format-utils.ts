import BigNumber from "bignumber.js";

import { makeDisplayNumber } from "../string-util";

export const safeString = (value: string | number | null | undefined): string => {
  if (value == null) return "";
  return String(value);
};

export const formatGasString = (gasWanted: number, gasUsed: number): string => {
  const gasWantedString = makeDisplayNumber(gasWanted);
  const gasUsedString = makeDisplayNumber(gasUsed);
  const rate = !gasWanted || gasWanted === 0 ? 0 : BigNumber(gasUsed).dividedBy(gasWanted).shiftedBy(2).toFixed(2);

  return `${gasUsedString}/${gasWantedString} (${rate}%)`;
};
