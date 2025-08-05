import BigNumber from "bignumber.js";

import { makeDisplayNumber } from "../string-util";
import { BYTES_PER_KB } from "@/common/values/constant-value";

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

export function mapDisplayFunctionName(type: string, functionName: string) {
  switch (type) {
    case "MsgAddPackage":
      return "AddPkg";
    case "BankMsgSend":
      return "Transfer";
    default:
      return functionName;
  }
}

export function convertBytesToKB(bytes: number | string | BigNumber): BigNumber {
  if (bytes == null || bytes === undefined || bytes === "") {
    return BigNumber(0);
  }

  const bytesBN = BigNumber(bytes.toString());

  if (bytesBN.isNaN()) {
    return BigNumber(0);
  }

  if (bytesBN.isNegative()) {
    return BigNumber(0);
  }

  return bytesBN.dividedBy(BYTES_PER_KB).integerValue(BigNumber.ROUND_DOWN);
}
