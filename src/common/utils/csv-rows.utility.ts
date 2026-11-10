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
  BigNumber(block.totalFees || 0)
    .shiftedBy(-GNOTToken.decimals)
    .toFixed(),
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

// The native token in GNOT; any other denom as it is. Empty when there is no amount.
const toAmountCells = (amount?: { value: string; denom: string }): CsvCell[] => {
  if (!amount?.value || !amount.denom) return ["", ""];
  const { value, denom } = toGNOTAmount(amount.value, amount.denom);

  return [value, denom];
};

export const toTransactionCsvRow = (tx: TransactionModel): CsvCell[] => {
  const func = getRepresentativeTransactionFunction(tx);

  return [
    tx.txHash,
    tx.successYn ? "Success" : "Failed",
    func ? mapDisplayFunctionName(func.messageType, func.funcType) : "",
    tx.messageCount,
    tx.blockHeight,
    toIsoTime(tx.timestamp),
    tx.fromAddress,
    tx.toAddress,
    ...toAmountCells(tx.amount),
    ...toAmountCells(tx.fee),
  ];
};
