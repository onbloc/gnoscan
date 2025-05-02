import { TransactionContractModel, TransactionSummary } from "@/repositories/api/transaction/response";
import { Transaction, TransactionContractInfo, TransactionSummaryInfo } from "@/types/data-type";

import { getTimeStamp } from "@/common/utils/date-util";
import { formatGasString } from "@/common/utils/format/format-utils";

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
      transactionItem: null,
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
}
