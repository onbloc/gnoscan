import BigNumber from "bignumber.js";

import { makeDisplayNumber } from "../string-util";
import { BYTE_UNITS, BYTES_PER_KB } from "@/common/values/constant-value";

interface ByteSizeResult {
  value: string;
  unit: string;
}

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

export function convertBytesToKB(bytes: number | string | BigNumber, decimalPlaces = 2): string {
  if (bytes == null || bytes === undefined || bytes === "") {
    return "0";
  }

  const bytesBN = BigNumber(bytes.toString());

  if (bytesBN.isNaN()) {
    return "0";
  }

  if (bytesBN.isNegative()) {
    return "0";
  }

  return bytesBN.dividedBy(BYTES_PER_KB).toFormat(decimalPlaces, BigNumber.ROUND_FLOOR);
}

export function formatBytes(bytes: number | string | BigNumber): ByteSizeResult {
  if (bytes == null || bytes === "") {
    return { value: "0", unit: BYTE_UNITS.BYTE.unit };
  }

  const bytesBN = BigNumber(bytes.toString()).abs();

  if (bytesBN.isNaN() || bytesBN.isNegative()) {
    return { value: "0", unit: BYTE_UNITS.BYTE.unit };
  }

  const bytesNum = bytesBN.toNumber();

  // GB
  if (bytesNum >= BYTE_UNITS.GB.value) {
    const value = bytesBN.dividedBy(BYTE_UNITS.GB.value).toFormat(2, BigNumber.ROUND_FLOOR);
    return { value, unit: BYTE_UNITS.GB.unit };
  }

  // MB
  if (bytesNum >= BYTE_UNITS.MB.value) {
    const value = bytesBN.dividedBy(BYTE_UNITS.MB.value).toFormat(2, BigNumber.ROUND_FLOOR);
    return { value, unit: BYTE_UNITS.MB.unit };
  }

  // KB
  if (bytesNum >= BYTE_UNITS.KB.value) {
    const value = bytesBN.dividedBy(BYTE_UNITS.KB.value).toFormat(2, BigNumber.ROUND_FLOOR);
    return { value, unit: BYTE_UNITS.KB.unit };
  }

  // byte
  return { value: bytesNum.toString(), unit: BYTE_UNITS.BYTE.unit };
}
