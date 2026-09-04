import { TransactionContractModel, TransactionSummary } from "@/repositories/api/transaction/response";
import { GnoEvent, Transaction, TransactionContractInfo, TransactionSummaryInfo } from "@/types/data-type";

import { getTimeStamp } from "@/common/utils/date-util";
import { formatGasString } from "@/common/utils/format/format-utils";
import { base64HashToHex, decodeTransaction } from "@/common/utils/transaction.utility";
import { parseTokenAmount } from "@/common/utils/token.utility";
import { EventModel } from "@/models/api/event/event-model";

export class TransactionMapper {
  public static transactionFromApiResponse(response: TransactionSummary): TransactionSummaryInfo {
    const timeStamp = getTimeStamp(response.timestamp);

    const gasWanted = response.gas.wanted || 0;
    const gasUsed = response.gas.used || 0;
    const gas = formatGasString(gasWanted, gasUsed);

    return {
      network: response.network,
      timeStamp,
      blockResult: "",
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
    let decoded: ReturnType<typeof decodeTransaction>;
    try {
      decoded = decodeTransaction(rawTx);
    } catch {
      // Malformed raw tx bytes from the pending endpoint: treat as a miss so the
      // caller keeps polling instead of showing a broken page.
      return null;
    }

    const gasWanted = Number(decoded.fee?.gas_wanted ?? 0);
    const feeAmount = parseTokenAmount(decoded.fee?.gas_fee || "0ugnot");

    return {
      network: "",
      timeStamp: { time: "", passedTime: "" },
      blockResult: "",
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
