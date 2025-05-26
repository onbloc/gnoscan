import { BlockModel, BlockSummaryModel } from "@/models/api/block/block-model";
import { EventModel } from "@/models/api/event/event-model";
import { Block, BlockSummaryInfo, GnoEvent, Transaction } from "@/types/data-type";

import { makeDisplayNumber } from "@/common/utils/string-util";
import { getTimeStamp } from "@/common/utils/date-util";
import { formatGasString, safeString } from "@/common/utils/format/format-utils";
import { TransactionTableModel } from "@/models/api/common";

export class BlockMapper {
  public static blockListFromApiResponses(responses: BlockModel[]): Block[] {
    return responses.map(response => this.blockListFromApiResponse(response));
  }

  public static blockListFromApiResponse(response: BlockModel): Block {
    return {
      hash: response.blockHash,
      height: response.blockHeight,
      time: new Date(response.timestamp).toISOString(),
      numTxs: response.transactionCount || 0,
      proposer: response.blockProposer,
      proposerRaw: response.blockProposerLabel,
      totalFees:
        response.totalFees > 0
          ? {
              value: response.totalFees.toString(),
              denom: "GNOT",
            }
          : null,
    };
  }

  public static blockFromApiResponse(response: BlockSummaryModel): BlockSummaryInfo {
    // timeStamp
    const timeStamp = getTimeStamp(response.timestamp);

    // gas
    const gasWanted = response.gasWanted || 0;
    const gasUsed = response.gasUsed || 0;
    const gas = formatGasString(gasWanted, gasUsed);

    // Todo: transactions
    return {
      timeStamp,
      network: safeString(response.network),
      blockHeight: response.blockHeight,
      blockHeightStr: safeString(response.blockHeight),
      numberOfTransactions: makeDisplayNumber(response.transactionCount),
      gas,
      proposerAddress: safeString(response.proposerAddress),
      proposerRaw: safeString(response.proposerLabel),
      transactions: [],
    };
  }

  public static blockEventsFromApiResponses(responses: EventModel[]): GnoEvent[] {
    return responses.map(response => this.blockEventsFromApiResopnse(response));
  }

  public static blockEventsFromApiResopnse(response: EventModel): GnoEvent {
    return {
      id: response.identifier,
      blockHeight: response.blockHeight,
      transactionHash: response.txHash,
      caller: response.caller,
      callerName: response.callerName,
      type: response.eventName,
      packagePath: response.realmPath,
      functionName: response.function,
      time: response.timestamp,
      attrs: response.emit.params,
    };
  }

  public static blockTransactionsFromApiResponses(responses: TransactionTableModel[]): Transaction[] {
    return responses.map(response => this.blockTransactionsFromApiResponse(response));
  }

  public static blockTransactionsFromApiResponse(response: TransactionTableModel): Transaction {
    return {
      hash: response.txHash,
      success: response.successYn,
      numOfMessage: response.messageCount,
      type: response.func[0].messageType,
      packagePath: response.func[0].pkgPath,
      functionName: response.func[0].funcType,
      blockHeight: response.blockHeight,
      from: response.fromAddress,
      fromName: response.fromName,
      to: response.toAddress,
      toName: response.toName,
      amount: response.amount,
      amountOut: { denom: "", value: "" },
      time: response.timestamp,
      fee: response.fee,
      gasUsed: { denom: "", value: "" },
      memo: "",
      rawContent: "",
      messages: [],
      events: [],
    };
  }
}
