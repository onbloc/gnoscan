import { TransactionContractModel, TransactionSummary } from "@/repositories/api/transaction/response";
import { GnoEvent, Transaction, TransactionContractInfo, TransactionSummaryInfo } from "@/types/data-type";

import { getTimeStamp } from "@/common/utils/date-util";
import { formatGasString } from "@/common/utils/format/format-utils";
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
          denom: "",
          value: "",
        },
        memo: "",
        amount: {
          denom: "",
          value: "",
        },
        from: "",
        functionName: "",
        hash: response.txHash,
        numOfMessage: 0,
        packagePath: "",
        time: "",
        type: "",
      },
      transactionEvents: [],
    };
  }

  public static transactionContractsFromApiResponses(responses: TransactionContractModel[]): TransactionContractInfo[] {
    return responses.map(response => this.transactionContractsFromApiResponse(response));
  }

  public static transactionContractsFromApiResponse(response: TransactionContractModel): TransactionContractInfo {
    return {
      messages: response.fields || [],
      numOfMessage: response.fields.length || 0,
      rawContent: "",
    };
  }

  public static transactionEventsFromApiResponse(response: EventModel): GnoEvent {
    const timeStamp = getTimeStamp(response.timestamp);

    return {
      id: response.identifier,
      packagePath: response.realmPath,
      caller: response.caller,
      functionName: response.function,
      type: response.eventName,
      attrs: [],
      blockHeight: response.blockHeight,
      transactionHash: response.txHash,
      time: timeStamp.time,
    };
  }

  public static transactionEventsFromApiResponses(responses: EventModel[]): GnoEvent[] {
    return responses.map(response => this.transactionEventsFromApiResponse(response));
  }
}
