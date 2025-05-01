import { GetBlocksRequestParameters } from "./request";
import { GetBlockEventsResponse, GetBlockResponse, GetBlocksResponse } from "./response";

export interface ApiBlockRepository {
  getBlocks(params: GetBlocksRequestParameters): Promise<GetBlocksResponse>;

  getBlock(height: string): Promise<GetBlockResponse>;

  getBlockEvents(height: string): Promise<GetBlockEventsResponse>;
}
