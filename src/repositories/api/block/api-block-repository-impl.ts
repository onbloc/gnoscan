import { ApiBlockRepository } from "./api-block-repository";

import { GetBlockEventsRequest, GetBlocksRequestParameters, GetBlockTransactionsRequest } from "./request";
import { GetBlocksResponse, GetBlockResponse, GetBlockEventsResponse, GetBlockTransactionsResponse } from "./response";
import { ApiRepository } from "../api-repository";
import { makeFunctionFilterQueryParameter } from "@/common/utils/function-filter.utility";

export class ApiBlockRepositoryImpl extends ApiRepository implements ApiBlockRepository {
  getBlocks(params: GetBlocksRequestParameters): Promise<GetBlocksResponse> {
    return this.get<GetBlocksResponse>("/blocks", { ...params });
  }

  getBlock(height: string): Promise<GetBlockResponse> {
    return this.get<GetBlockResponse>(`blocks/${height}`);
  }

  getBlockEvents(params: GetBlockEventsRequest): Promise<GetBlockEventsResponse> {
    const { blockHeight, ...queryParams } = params;
    return this.get<GetBlockEventsResponse>(`blocks/${blockHeight}/events`, queryParams);
  }

  getBlockTransactions(params: GetBlockTransactionsRequest): Promise<GetBlockTransactionsResponse> {
    const { blockHeight, ...queryParams } = params;
    return this.get<GetBlockTransactionsResponse>(
      `blocks/${blockHeight}/transactions${makeFunctionFilterQueryParameter(queryParams)}`,
    );
  }
}
