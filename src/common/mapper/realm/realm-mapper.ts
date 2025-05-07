import { RealmEventModel, RealmModel, RealmSummaryModel, RealmTransactionModel } from "@/models/api/realm/realm-model";
import { GnoEvent, Realm, RealmSummary, Transaction } from "@/types/data-type";

export class RealmMapper {
  public static realmListFromApiResponse(response: RealmModel): Realm {
    const totalCallCount = (response.totalCallCountSuccess || 0) + (response.totalCallCountFailed || 0);

    return {
      hash: response.txHash,
      index: response.index,
      success: response.success,
      blockHeight: response.blockHeight,
      packageName: response.name,
      packagePath: response.path,
      creator: response.publisher,
      functionCount: response.funcCount,
      totalCalls: totalCallCount,
      totalGasUsed: response.totalGasUsed,
    };
  }

  public static realmListFromApiResponses(responses: RealmModel[]): Realm[] {
    return responses.map(response => this.realmListFromApiResponse(response));
  }

  public static realmSummaryFromApiResponse(response: RealmSummaryModel): RealmSummary {
    return {
      name: response.name,
      path: response.path,
      realmAddress: response.realmAddress,
      publisherAddress: response.publisher,
      funcs: response.func.map(func => func.typesList),
      blockPublished: response.blockPublished,
      files: response.sourceFiles.map(file => {
        return { name: file.filename, body: file.content };
      }),
      balance: { denom: "", value: "" },
      contractCalls: response.contractCallCount || 0,
      totalUsedFees: response.totalUsedFees,
    };
  }

  public static realmTransactionFromApiResponses(responses: RealmTransactionModel[]): Transaction[] {
    return responses.map(response => this.realmTransactionFromApiResponse(response));
  }

  public static realmTransactionFromApiResponse(response: RealmTransactionModel): Transaction {
    return {
      amount: response.amount,
      blockHeight: response.block,
      fee: response.fee,
      from: response.from,
      to: "",
      functionName: response.func[0].pkgPath,
      hash: response.txHash,
      numOfMessage: response.func.length,
      packagePath: "",
      success: false,
      time: response.timestamp,
      type: response.func[0].funcType,
    };
  }

  public static realmEventFromApiResponses(responses: RealmEventModel[]): GnoEvent[] {
    return responses.map(response => this.realmEventFromApiResponse(response));
  }

  public static realmEventFromApiResponse(response: RealmEventModel): GnoEvent {
    return {
      attrs: response.emit.params,
      blockHeight: response.blockHeight,
      caller: response.caller,
      functionName: response.function,
      id: response.identifier,
      packagePath: response.realmPath,
      time: response.timestamp,
      transactionHash: response.txHash,
      type: "",
    };
  }
}
