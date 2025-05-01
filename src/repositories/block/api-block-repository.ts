import { GetBlocksRequestParameters } from "./request";
import { GetBlockResponse, GetBlocksResponse } from "./response";

export interface ApiBlockRepository {
  getBlocks(params: GetBlocksRequestParameters): Promise<GetBlocksResponse>;

  getBlock(height: string): Promise<GetBlockResponse>;
}
