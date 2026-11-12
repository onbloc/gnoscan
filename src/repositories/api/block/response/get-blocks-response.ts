import { BlockModel } from "@/models/api/block/block-model";

export interface GetBlocksResponse {
  items: BlockModel[];

  page: {
    hasNext: boolean;
    totalCount: number;
    /** Block height the list is pinned to; absent when the chain has no blocks. */
    snapshotHeight?: number;
  };
}
