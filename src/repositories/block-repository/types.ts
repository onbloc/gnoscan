/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlockResults } from "@/common/clients/node-client";
import { BlockInfo, BlockMeta } from "@gnolang/tm2-js-client";

export interface IBlockRepository {
  getLatestBlockHeight(): Promise<number | null>;

  getBlocks(minHeight: number, maxHeight: number): Promise<BlockMeta[]>;

  getBlock(height: number): Promise<BlockInfo | null>;

  getBlockResult(height: number): Promise<BlockResults | null>;

  getBlockTime(height: number): Promise<string | null>;
}
