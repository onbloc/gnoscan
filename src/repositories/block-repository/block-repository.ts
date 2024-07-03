import {BlockMeta, BlockResults, NodeRPCClient} from '@/common/clients/node-client';
import {IBlockRepository} from './types';

export class BlockRepository implements IBlockRepository {
  constructor(private nodeRPCClient: NodeRPCClient | null) {}

  async getLatestBlockHeight(): Promise<number | null> {
    if (!this.nodeRPCClient) {
      return null;
    }

    return this.nodeRPCClient
      .status()
      .then(status => Number(status.sync_info.latest_block_height))
      .catch(() => null);
  }

  async getBlock(height: number): Promise<any | null> {
    if (!this.nodeRPCClient) {
      return null;
    }

    return this.nodeRPCClient.block(height).catch(() => null);
  }

  async getBlockResult(height: number): Promise<BlockResults | null> {
    if (!this.nodeRPCClient) {
      return null;
    }

    return this.nodeRPCClient
      .blockResults(height)
      .then(result => result.results)
      .catch(() => null);
  }

  async getBlocks(minHeight: number, maxHeight: number): Promise<BlockMeta[]> {
    if (!this.nodeRPCClient) {
      return [];
    }

    return this.nodeRPCClient
      .blockchain(minHeight, maxHeight)
      .then(response => response.block_metas);
  }
}
