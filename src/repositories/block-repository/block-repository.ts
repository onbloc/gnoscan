import {BlockMeta, BlockResults, NodeRPCClient} from '@/common/clients/node-client';
import {IBlockRepository} from './types';
import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {gql} from '@apollo/client';

export class BlockRepository implements IBlockRepository {
  private blockTimeMap: {[key in number]: string} = {};

  constructor(
    private nodeRPCClient: NodeRPCClient | null,
    private indexerClient: IndexerClient | null,
  ) {}

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

  async getBlockTime(height: number): Promise<string | null> {
    if (!this.nodeRPCClient) {
      return null;
    }

    if (!this.indexerClient) {
      const time = this.getBlock(height)
        .then(block => block?.block_meta?.header?.time || null)
        .catch(() => null);
      if (!time) {
        this.blockTimeMap[height] = time;
      }
      return time;
    }

    const time = await this.indexerClient
      .query(
        gql`
{
  blocks(filter: {
    from_height: ${height}
    to_height: ${height + 1}
  }) {
    time
  }
}`,
      )
      .then(result => result?.data?.blocks?.[0]?.time || null)
      .catch(() => null);
    if (!time) {
      this.blockTimeMap[height] = time;
    }
    return time;
  }
}
