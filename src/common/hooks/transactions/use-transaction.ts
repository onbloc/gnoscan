/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from "bignumber.js";
import { useMemo } from "react";

import { useGetTransactionBlockHeightQuery } from "@/common/react-query/transaction";
import { getDateDiff, getLocalDateString } from "@/common/utils/date-util";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { parseTokenAmount } from "@/common/utils/token.utility";
import { decodeTransaction, makeSafeBase64Hash, makeTransactionMessageInfo } from "@/common/utils/transaction.utility";
import { Transaction, TransactionSummaryInfo } from "@/types/data-type";
import { GNOTToken, useTokenMeta } from "../common/use-token-meta";

export const useTransaction = (hash: string) => {
  const safetyHash = makeSafeBase64Hash(hash);
  const { getTokenAmount } = useTokenMeta();
  const { data, isFetched, isError: isErrorTxHash } = useGetTransactionBlockHeightQuery(safetyHash);

  const block = useMemo(() => {
    return data?.block || null;
  }, [data?.block]);

  const blockResult = useMemo(() => {
    return data?.blockResult || null;
  }, [data?.blockResult]);

  const timeStamp = useMemo(() => {
    if (!block) {
      return {
        time: "-",
        passedTime: "",
      };
    }

    return {
      time: getLocalDateString(block.block_meta.header.time),
      passedTime: getDateDiff(block.block_meta.header.time),
    };
  }, [block]);

  const network = useMemo(() => {
    if (!block) {
      return "-";
    }
    return block.block.header.chain_id;
  }, [block]);

  const blockHeight = useMemo(() => {
    if (!block) {
      return null;
    }
    return Number(block.block.header.height);
  }, [block]);

  const transactions = useMemo(() => {
    if (!block) {
      return [];
    }
    return block.block.data.txs?.map(decodeTransaction);
  }, [block]);

  const txResult = useMemo(() => {
    if (!transactions || !blockResult) {
      return null;
    }

    const txIndex = transactions.findIndex((tx: any) => tx.hash === safetyHash);
    return (blockResult.deliver_tx || []).find((_: any, index: number) => txIndex === index) || null;
  }, [transactions, blockResult, safetyHash]);

  const transactionItem: Transaction | null = useMemo(() => {
    const transaction = transactions.find((tx: any) => tx.hash === safetyHash) || null;
    if (!transaction || !txResult) {
      return null;
    }

    const firstMessage = makeTransactionMessageInfo(transaction.messages[0]);
    const feeAmount = parseTokenAmount(transaction.fee?.gasFee || "0ugnot");

    return {
      hash: transaction.hash,
      messages: transaction?.messages,
      success: !txResult?.Error && !txResult?.ResponseBase?.Error,
      numOfMessage: transaction.messages.length,
      type: firstMessage?.type || "",
      packagePath: firstMessage?.packagePath || "",
      functionName: firstMessage?.functionName || "",
      blockHeight: blockHeight || 0,
      from: firstMessage?.from || "",
      to: firstMessage?.to || "",
      amount: firstMessage?.amount || {
        value: "0",
        denom: "ugnot",
      },
      time: block?.block_meta.header.time || "",
      fee: getTokenAmount(GNOTToken.denom, feeAmount.toString()),
      memo: transaction.memo || "-",
      events: ((txResult?.ResponseBase?.Events as any[]) || [])?.map((event, index) => ({
        id: `${transaction.hash}_${index}`,
        blockHeight: blockHeight || 0,
        transactionHash: transaction.hash,
        type: event.type,
        packagePath: event.pkg_path,
        functionName: event.func,
        attrs: event.attrs,
        time: block.block.header.time,
        caller: firstMessage?.from || "",
      })),
      rawContent: JSON.stringify(
        {
          messages: transaction?.messages || "",
          fee: transaction?.fee || "",
          signatures: transaction?.signatures || "",
          memo: transaction?.memo || "",
        },
        null,
        2,
      ),
    };
  }, [block, transactions, txResult, getTokenAmount]);

  const transactionGasInfo = useMemo(() => {
    if (!txResult) {
      return {
        gasWanted: 0,
        gasUsed: 0,
      };
    }
    return {
      gasWanted: Number(txResult.GasWanted),
      gasUsed: Number(txResult.GasUsed),
    };
  }, [txResult]);

  const gas = useMemo(() => {
    const gasWanted = makeDisplayNumber(transactionGasInfo.gasWanted);
    const gasUsed = makeDisplayNumber(transactionGasInfo.gasUsed);
    const rate =
      transactionGasInfo.gasWanted === 0
        ? 0
        : BigNumber(transactionGasInfo.gasUsed).dividedBy(transactionGasInfo.gasWanted).shiftedBy(2).toFixed(2);
    return `${gasUsed}/${gasWanted} (${rate}%)`;
  }, [transactionGasInfo]);

  const transactionEvents = useMemo(() => {
    if (!transactionItem?.events) {
      return [];
    }
    return transactionItem.events;
  }, [transactionItem?.events]);

  const isError = useMemo(() => {
    if (!isFetched) {
      return false;
    }
    return data?.block === null || isErrorTxHash;
  }, [data?.block, isErrorTxHash, isFetched]);

  const transactionSummaryInfo: TransactionSummaryInfo = useMemo(() => {
    return {
      network,
      timeStamp,
      blockResult,
      gas,
      transactionItem,
      transactionEvents,
    };
  }, [network, timeStamp, blockResult, gas, transactionItem, transactionEvents]);

  return {
    transaction: transactionSummaryInfo,
    isFetched,
    isError,
  };
};
