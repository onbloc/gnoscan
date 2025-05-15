import { GetBlocksRequestParameters, GetBlockTransactionsRequest } from "./request";
import { GetBlockEventsResponse, GetBlockResponse, GetBlocksResponse, GetBlockTransactionsResponse } from "./response";

export interface ApiBlockRepository {
  getBlocks(params: GetBlocksRequestParameters): Promise<GetBlocksResponse>;

  getBlock(height: string): Promise<GetBlockResponse>;

  getBlockEvents(height: string): Promise<GetBlockEventsResponse>;

  getBlockTransactions(params: GetBlockTransactionsRequest): Promise<GetBlockTransactionsResponse>;
}
