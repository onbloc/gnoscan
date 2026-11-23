import { TransactionSummary } from "@/repositories/api/transaction/response";
import { Amount, GnoEvent, Transaction, TransactionSummaryInfo } from "@/types/data-type";

import { BlockInfo, base64ToUint8Array } from "@gnolang/tm2-js-client";
import { BlockResults, DeliverTx } from "@/common/clients/node-client";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { parseTransactionEvents } from "@/common/utils/event-parser.utility";
import { getTimeStamp } from "@/common/utils/date-util";
import { tryOrDefault } from "@/common/utils/common.utility";
import { formatGasString } from "@/common/utils/format/format-utils";
import {
  base64HashToHex,
  DecodedTransaction,
  decodeTransaction,
  makeHash,
  makeTransactionMessageInfo,
} from "@/common/utils/transaction.utility";
import { makeTransactionRawContent } from "@/common/utils/amino-json.utility";
import { parseTokenAmount } from "@/common/utils/token.utility";
import { EventModel } from "@/models/api/event/event-model";

export class TransactionMapper {
  public static transactionFromRpcBlock(
    block: BlockInfo | null | undefined,
    blockResult: BlockResults | null | undefined,
    hash: string,
    getTokenAmount: (tokenId: string, amountRaw: string | number) => Amount,
  ): TransactionSummaryInfo {
    const txs = block?.block.data.txs ?? [];
    const txIndex = txs.findIndex(rawTx => tryOrDefault(() => makeHash(base64ToUint8Array(rawTx)) === hash, false));
    const rawTx = txs[txIndex];
    const transaction =
      rawTx === undefined ? null : tryOrDefault<DecodedTransaction | null>(() => decodeTransaction(rawTx), null);
    const txResult = transaction ? blockResult?.deliver_tx[txIndex] || null : null;
    const transactionItem =
      block && transaction && txResult
        ? this.transactionItemFromRpc(block, transaction, txResult, getTokenAmount)
        : null;

    return {
      network: block?.block.header.chain_id ?? "-",
      timeStamp: block ? getTimeStamp(block.block_meta.header.time) : { time: "-", passedTime: "" },
      txResult,
      gas: formatGasString(Number(txResult?.GasWanted ?? 0), Number(txResult?.GasUsed ?? 0)),
      transactionItem,
      transactionEvents: transactionItem?.events || [],
    };
  }

  private static transactionItemFromRpc(
    block: BlockInfo,
    transaction: DecodedTransaction,
    txResult: DeliverTx,
    getTokenAmount: (tokenId: string, amountRaw: string | number) => Amount,
  ): Transaction {
    const blockHeight = Number(block.block.header.height);
    const firstMessage = makeTransactionMessageInfo(transaction.messages[0]);
    const feeAmount = parseTokenAmount(transaction.fee?.gas_fee || "0ugnot");

    return {
      hash: transaction.hash,
      messages: transaction.messages,
      success: !txResult.ResponseBase.Error,
      numOfMessage: transaction.messages.length,
      type: firstMessage?.type || "",
      packagePath: firstMessage?.packagePath || "",
      functionName: firstMessage?.functionName || "",
      blockHeight,
      from: firstMessage?.from || "",
      to: firstMessage?.to || "",
      amount: firstMessage?.amount || {
        value: "0",
        denom: GNOTToken.denom,
      },
      time: block.block_meta.header.time,
      fee: getTokenAmount(GNOTToken.denom, feeAmount.toString()),
      memo: transaction.memo || "-",
      events: parseTransactionEvents(
        txResult.ResponseBase.Events ?? [],
        transaction.hash,
        blockHeight,
        block.block.header.time,
        firstMessage?.from || "",
      ),
      rawContent: makeTransactionRawContent(transaction),
    };
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
    const decoded = tryOrDefault<DecodedTransaction | null>(() => decodeTransaction(rawTx), null);
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
