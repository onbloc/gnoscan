import BigNumber from "bignumber.js";

import { BlockModel } from "@/models/api/block/block-model";
import { GetBlockResponse } from "@/repositories/api/block/response";
import { EventModel } from "@/models/api/event/event-model";
import { Block, BlockSummaryInfo, GnoEvent } from "@/types/data-type";

import { makeDisplayNumber, makeDisplayNumberWithDefault } from "@/common/utils/string-util";
import { getDateDiff, getLocalDateString } from "@/common/utils/date-util";
import { safeString } from "@/common/utils/format/format-utils";

export class BlockMapper {
  public static blockListFromApiResponses(responses: BlockModel[]): Block[] {
    return responses.map(response => this.blockListFromApiResponse(response));
  }

  public static blockListFromApiResponse(response: BlockModel): Block {
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

  public static blockFromApiResponse(response: GetBlockResponse): BlockSummaryInfo {
    // timeStamp
    const timeStamp = response.timestamp
      ? { time: getLocalDateString(response.timestamp), passedTime: getDateDiff(response.timestamp) }
      : { time: "-", passedTime: "-" };

    // gas
    const gasWanted = makeDisplayNumber(response.gasWanted || 0);
    const gasUsed = makeDisplayNumber(response.gasUsed || 0);
    const rate =
      !response.gasWanted || response.gasWanted === 0
        ? 0
        : BigNumber(response.gasUsed || 0)
            .dividedBy(response.gasWanted)
            .shiftedBy(2)
            .toFixed(2);
    const gas = `${gasUsed}/${gasWanted} (${rate}%)`;

    // Todo: transactions

    return {
      timeStamp,
      network: safeString(response.network),
      blockHeight: response.blockHeight,
      blockHeightStr: safeString(response.blockHeight),
      numberOfTransactions: makeDisplayNumberWithDefault(response.totalTransactionCount),
      gas,
      proposerAddress: safeString(response.proposerAddress),
      transactions: [],
    };
  }

  public static blockEventsFromApiResponses(responses: EventModel[]): GnoEvent[] {
    return responses.map(response => this.blockEventsFromApiResopnse(response));
  }

  public static blockEventsFromApiResopnse(resopnse: EventModel): GnoEvent {
    return {
      id: "",
      blockHeight: 0,
      transactionHash: "",
      caller: "",
      type: "",
      packagePath: "",
      functionName: "",
      time: "",
      attrs: [],
    };
  }
}
