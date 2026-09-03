import { GetBlocksRequestParameters, GetBlockEventsRequest, GetBlockTransactionsRequest } from "./request";
import {
  GetBlockEventsResponse,
  GetBlockResponse,
  GetBlocksResponse,
  GetBlockTransactionsResponse,
  GetBlockTransactionsCountResponse,
} from "./response";

export interface ApiBlockRepository {
  getBlocks(params: GetBlocksRequestParameters): Promise<GetBlocksResponse>;

  getBlock(height: string): Promise<GetBlockResponse>;

  getBlockEvents(params: GetBlockEventsRequest): Promise<GetBlockEventsResponse>;

  getBlockTransactions(params: GetBlockTransactionsRequest): Promise<GetBlockTransactionsResponse>;

  getBlockTransactionsCount(height: string): Promise<GetBlockTransactionsCountResponse>;
}
