import { GetBlocksRequestParameters } from "./request";
import { GetBlocksResponse } from "./response";

export interface ApiBlockRepository {
  getBlocks(params: GetBlocksRequestParameters): Promise<GetBlocksResponse>;
}
