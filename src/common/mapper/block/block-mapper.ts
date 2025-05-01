import { BlockModel } from "@/models/api/block/block-model";
import { Block } from "@/types/data-type";

export class BlockMapper {
  public static fromApiResponse(response: BlockModel): Block {
    return {
      hash: response.blockHash,
      height: response.blockHeight,
      time: new Date(response.timestamp).toString(),
      numTxs: response.totalTransactionCount,
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

  public static fromApiResponses(responses: BlockModel[]): Block[] {
    return responses.map(response => this.fromApiResponse(response));
  }
}
