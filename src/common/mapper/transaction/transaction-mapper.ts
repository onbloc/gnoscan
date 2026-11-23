import { TransactionSummary } from "@/repositories/api/transaction/response";
import { Amount, GnoEvent, Transaction, TransactionSummaryInfo } from "@/types/data-type";

import BigNumber from "bignumber.js";
import { BlockInfo, base64ToUint8Array } from "@gnolang/tm2-js-client";
import { BlockResults } from "@/common/clients/node-client";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { parseTransactionEvents } from "@/common/utils/event-parser.utility";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { getDateDiff, getLocalDateString, getTimeStamp } from "@/common/utils/date-util";
import { tryOrDefault } from "@/common/utils/common.utility";
import { formatGasString } from "@/common/utils/format/format-utils";
import {
  base64HashToHex,
  decodeTransaction,
  decodeTransactionSafely,
  makeHash,
  makeTransactionMessageInfo,
  makeTransactionRawContent,
} from "@/common/utils/transaction.utility";
import { parseTokenAmount } from "@/common/utils/token.utility";
import { EventModel } from "@/models/api/event/event-model";

export class TransactionMapper {
  public static transactionFromRpcBlock(
    block: BlockInfo | null | undefined,
    blockResult: BlockResults | null | undefined,
    hash: string,
    getTokenAmount: (tokenId: string, amountRaw: string | number) => Amount,
  ): TransactionSummaryInfo {
    const timeStamp = block
      ? {
          time: getLocalDateString(block.block_meta.header.time),
          passedTime: getDateDiff(block.block_meta.header.time),
        }
      : { time: "-", passedTime: "" };
    const network = block?.block.header.chain_id ?? "-";
    const blockHeight = block ? Number(block.block.header.height) : null;
    const txIndex =
      block?.block.data.txs?.findIndex(rawTx =>
        tryOrDefault(() => makeHash(base64ToUint8Array(rawTx)) === hash, false),
      ) ?? -1;
    const rawTx = txIndex >= 0 ? block?.block.data.txs?.[txIndex] : undefined;
    const transaction = rawTx === undefined ? null : decodeTransactionSafely(rawTx);
    const txResult = transaction?.hash === hash ? blockResult?.deliver_tx[txIndex] || null : null;
    let transactionItem: Transaction | null = null;
    if (transaction && txResult) {
      const firstMessage = makeTransactionMessageInfo(transaction.messages[0]);
      const feeAmount = parseTokenAmount(transaction.fee?.gas_fee || "0ugnot");

      transactionItem = {
        hash: transaction.hash,
        messages: transaction?.messages,
        success: !txResult?.ResponseBase?.Error,
        numOfMessage: transaction.messages.length,
        type: firstMessage?.type || "",
        packagePath: firstMessage?.packagePath || "",
        functionName: firstMessage?.functionName || "",
        blockHeight: blockHeight || 0,
        from: firstMessage?.from || "",
        to: firstMessage?.to || "",
        amount: firstMessage?.amount || {
          value: "0",
          denom: GNOTToken.denom,
        },
        time: block?.block_meta.header.time || "",
        fee: getTokenAmount(GNOTToken.denom, feeAmount.toString()),
        memo: transaction.memo || "-",
        events: parseTransactionEvents(
          txResult?.ResponseBase?.Events ?? [],
          transaction.hash,
          blockHeight || 0,
          block?.block.header.time || "",
          firstMessage?.from || "",
        ),
        rawContent: makeTransactionRawContent(transaction),
      };
    }
    const gasWanted = txResult ? Number(txResult.GasWanted) : 0;
    const gasUsed = txResult ? Number(txResult.GasUsed) : 0;
    const rate = gasWanted === 0 ? 0 : BigNumber(gasUsed).dividedBy(gasWanted).shiftedBy(2).toFixed(2);
    const gas = `${makeDisplayNumber(gasUsed)}/${makeDisplayNumber(gasWanted)} (${rate}%)`;

    return { network, timeStamp, txResult, gas, transactionItem, transactionEvents: transactionItem?.events || [] };
  }

  public static transactionFromApiResponse(response: TransactionSummary): TransactionSummaryInfo {
    const timeStamp = getTimeStamp(response.timestamp);

    const gasWanted = response.gas.wanted || 0;
    const gasUsed = response.gas.used || 0;
    const gas = formatGasString(gasWanted, gasUsed);

    return {
      network: response.network,
      timeStamp,
      gas,
      transactionItem: {
        success: response.success,
        blockHeight: response.blockHeight,
        fee: {
          denom: response.transactionFee.denom || "GNOT",
          value: response.transactionFee.value || "0",
        },
        memo: response.memo,
        amount: {
          denom: "",
          value: "",
        },
        from: "",
        functionName: "",
        hash: response.txHash,
        hashBase64: response.txHashBase64,
        numOfMessage: 0,
        packagePath: "",
        time: "",
        type: "",
        rawContent: response.errorLog,
      },
      storageDeposit: response.storageDeposit,
      storageUsage: response.storageUsage,
      transactionEvents: [],
      hasApplicationError: response.hasApplicationError,
      summary: response.summary,
    };
  }

  /**
   * Builds a TransactionSummaryInfo from a pending tx's raw mempool bytes (GET
   * /v1/transactions/{hash}/pending). Only fields that can be read off the raw
   * std.Tx are populated (memo, fee, gas wanted, decoded messages) — nothing that
   * requires block inclusion or execution results (timestamp, block height, gas
   * used, success, storage deposit/usage) exists yet, so those are left out
   * rather than filled in with placeholders.
   */
  public static transactionFromPendingRawTx(rawTx: string): TransactionSummaryInfo | null {
    // Malformed raw tx bytes from the pending endpoint fall back to null, so the
    // caller treats it as a miss and keeps polling instead of showing a broken page.
    const decoded = tryOrDefault<ReturnType<typeof decodeTransaction> | null>(() => decodeTransaction(rawTx), null);
    if (!decoded) {
      return null;
    }

    const gasWanted = Number(decoded.fee?.gas_wanted ?? 0);
    const feeAmount = parseTokenAmount(decoded.fee?.gas_fee || "0ugnot");

    return {
      network: "",
      timeStamp: { time: "", passedTime: "" },
      gas: "",
      transactionItem: {
        success: false,
        isPending: true,
        blockHeight: 0,
        fee: {
          value: feeAmount.toString(),
          denom: "ugnot",
        },
        memo: decoded.memo || "",
        amount: {
          denom: "",
          value: "",
        },
        from: "",
        functionName: "",
        hash: base64HashToHex(decoded.hash),
        hashBase64: decoded.hash,
        gasWanted,
        numOfMessage: decoded.messages?.length || 0,
        packagePath: "",
        time: "",
        type: "",
        messages: decoded.messages,
      },
      transactionEvents: [],
    };
  }

  public static transactionEventsFromApiResponse(response: EventModel): GnoEvent {
    return {
      id: response.identifier,
      packagePath: response.realmPath,
      caller: response.caller,
      callerName: response.callerName,
      callerLabel: response.callerLabel,
      callerLabelType: response.callerLabelType,
      originCaller: response.originCaller,
      originCallerLabel: response.originCallerLabel,
      originCallerLabelType: response.originCallerLabelType,
      functionName: response.function,
      type: response.eventName,
      attrs: response.emit.params,
      blockHeight: response.blockHeight,
      transactionHash: response.txHash,
      time: new Date(response.timestamp).toISOString(),
    };
  }

  public static transactionEventsFromApiResponses(responses: EventModel[]): GnoEvent[] {
    return responses.map(response => this.transactionEventsFromApiResponse(response));
  }
}
