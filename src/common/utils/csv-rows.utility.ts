import BigNumber from "bignumber.js";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { BlockModel } from "@/models/api/block/block-model";
import { TransactionModel } from "@/models/api/transaction/transaction-model";
import { CsvCell } from "./csv.utility";
import { mapDisplayFunctionName } from "./format/format-utils";
import { toGNOTAmount } from "./native-token-utility";
import { getRepresentativeTransactionFunction } from "./transaction-list.utility";

// UTC ISO 8601; a value that is not a date stays as the API sent it.
const toIsoTime = (timestamp: string) => {
  const time = new Date(timestamp);

  return Number.isNaN(time.getTime()) ? timestamp : time.toISOString();
};

// Match AmountText's six fractional digits without grouping or rounding.
export const toCsvAmountValue = (value: string): string => {
  const ungrouped = value.replace(/,/g, "");
  const amount = BigNumber(ungrouped);
  if (!ungrouped || amount.isNaN()) return "";

  const decimalValue = /e/i.test(ungrouped) ? amount.toFixed() : ungrouped;
  const [integer, fraction = "0"] = decimalValue.split(".");

  return `${BigNumber(integer).toFixed(0)}${fraction && fraction !== "0" ? `.${fraction.slice(0, 6)}` : ""}`;
};

export const BLOCK_CSV_HEADER = [
  "Block Hash",
  "Height",
  "Time (UTC)",
  "Tx Count",
  "Proposer",
  "Proposer Label",
  "Total Fees (GNOT)",
];

export const toBlockCsvRow = (block: BlockModel): CsvCell[] => [
  block.blockHash,
  block.blockHeight,
  toIsoTime(block.timestamp),
  block.transactionCount,
  block.blockProposer,
  block.blockProposerLabel,
  // Exact decimal: a float could not hold a large total.
  toCsvAmountValue(
    BigNumber(block.totalFees || 0)
      .shiftedBy(-GNOTToken.decimals)
      .toFixed(),
  ),
];

export const TRANSACTION_CSV_HEADER = [
  "Tx Hash",
  "Status",
  "Function",
  "Messages",
  "Block",
  "Time (UTC)",
  "From",
  "To",
  "Amount",
  "Amount Denom",
  "Fee",
  "Fee Denom",
];

const toFeeCells = (amount?: { value: string; denom: string }): CsvCell[] => {
  if (!amount?.value || !amount.denom) return ["", ""];
  const { value, denom } = toGNOTAmount(amount.value, amount.denom);

  return [toCsvAmountValue(value), denom];
};

export const toTransactionCsvRow = (
  tx: TransactionModel,
  resolvedAmount: { value: string; denom: string } | null,
): CsvCell[] => {
  const func = getRepresentativeTransactionFunction(tx);
  const amountCells: CsvCell[] =
    tx.messageCount > 1
      ? ["More", ""]
      : tx.amount?.value && BigNumber(tx.amount.value).isZero()
      ? ["-", ""]
      : resolvedAmount
      ? [toCsvAmountValue(resolvedAmount.value), resolvedAmount.denom]
      : ["", ""];

  return [
    tx.txHash,
    tx.successYn ? "Success" : "Failed",
    func ? mapDisplayFunctionName(func.messageType, func.funcType) : "",
    tx.messageCount,
    tx.blockHeight,
    toIsoTime(tx.timestamp),
    tx.fromAddress,
    tx.toAddress,
    ...amountCells,
    ...toFeeCells(tx.fee),
  ];
};
