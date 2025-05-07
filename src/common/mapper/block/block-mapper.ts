import { BlockModel, BlockSummaryModel } from "@/models/api/block/block-model";
import { EventModel } from "@/models/api/event/event-model";
import { Block, BlockSummaryInfo, GnoEvent, Transaction } from "@/types/data-type";

import { makeDisplayNumber } from "@/common/utils/string-util";
import { getTimeStamp } from "@/common/utils/date-util";
import { formatGasString, safeString } from "@/common/utils/format/format-utils";
import { BlockTransactionModel } from "@/models/api/block/block-transaction-model";

export class BlockMapper {
  public static blockListFromApiResponses(responses: BlockModel[]): Block[] {
    return responses.map(response => this.blockListFromApiResponse(response));
  }

  public static blockListFromApiResponse(response: BlockModel): Block {
    return {
      hash: response.blockHash,
      height: response.blockHeight,
      time: new Date(response.timestamp).toString(),
      numTxs: response.totalTransactionCount || 0,
      proposer: response.blockProposer,
      proposerRaw: response.blockProposer,
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
      type: "",
      packagePath: response.realmPath,
      functionName: response.eventName,
      time: response.timestamp,
      attrs: [],
    };
  }

  public static blockTransactionsFromApiResponses(responses: BlockTransactionModel[]): Transaction[] {
    return responses.map(response => this.blockTransactionsFromApiResponse(response));
  }

  public static blockTransactionsFromApiResponse(response: BlockTransactionModel): Transaction {
    return {
      hash: response.txHash,
      success: response.success,
      numOfMessage: response.numOfMessage,
      type: response.func[0].messageType,
      packagePath: response.func[0].pkgPath,
      functionName: response.func[0].pkgPath,
      blockHeight: response.blockHeight,
      from: response.from,
      to: response.to,
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
