import { ApiBlockRepository } from "./api-block-repository";

import { GetBlockEventsRequest, GetBlocksRequestParameters, GetBlockTransactionsRequest } from "./request";
import {
  GetBlocksResponse,
  GetBlockResponse,
  GetBlockEventsResponse,
  GetBlockTransactionsResponse,
  GetBlockTransactionsCountResponse,
} from "./response";
import { ApiRepository } from "../api-repository";

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
    return this.get<GetBlockTransactionsResponse>(`blocks/${blockHeight}/transactions`, queryParams);
  }

  getBlockTransactionsCount(height: string): Promise<GetBlockTransactionsCountResponse> {
    return this.get<GetBlockTransactionsCountResponse>(`blocks/${height}/transactions/count`);
  }
}
