/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlockMeta } from "@gnolang/tm2-js-client";

export interface IBlockRepository {
  getLatestBlockHeight(): Promise<number | null>;

  getBlocks(minHeight: number, maxHeight: number): Promise<BlockMeta[]>;

  getBlock(height: number): Promise<any>;

  getBlockResult(height: number): Promise<any>;

  getBlockTime(height: number): Promise<string | null>;
}
