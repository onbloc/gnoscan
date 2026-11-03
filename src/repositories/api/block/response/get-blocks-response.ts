import { BlockModel } from "@/models/api/block/block-model";

export interface GetBlocksResponse {
  items: BlockModel[];

  page: {
    hasNext: boolean;
    totalCount: number;
  };
}
