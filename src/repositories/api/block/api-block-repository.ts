import { GetBlocksRequestParameters, GetBlockEventsRequest, GetBlockTransactionsRequest } from "./request";
import { GetBlockEventsResponse, GetBlockResponse, GetBlocksResponse, GetBlockTransactionsResponse } from "./response";

export interface ApiBlockRepository {
  getBlocks(params: GetBlocksRequestParameters): Promise<GetBlocksResponse>;

  getBlock(height: string): Promise<GetBlockResponse>;

  getBlockEvents(params: GetBlockEventsRequest): Promise<GetBlockEventsResponse>;

  getBlockTransactions(params: GetBlockTransactionsRequest): Promise<GetBlockTransactionsResponse>;
}
