import { RealmModel } from "@/models/api/realm/realm-model";
import { Realm } from "@/types/data-type";

export class RealmMapper {
  public static fromApiResponse(response: RealmModel): Realm {
    return {
      hash: response.txHash,
      index: response.index,
      success: response.success,
      blockHeight: response.blockHeight,
      packageName: response.name,
      packagePath: response.path,
      creator: response.publisher,
      functionCount: response.funcCount,
      totalCalls: response.totalCallCount,
      totalGasUsed: {
        value: response.totalGasUsed,
        denom: "GNOT",
      },
    };
  }

  public static fromApiResponses(responses: RealmModel[]): Realm[] {
    return responses.map(response => this.fromApiResponse(response));
  }
}
