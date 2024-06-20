import {RPCClient} from '@/common/clients/rpc-client';
import {
  IIndexerRepository,
  IndexerResultGetBlock,
  IndexerResultGetTxResult,
  IndexerResultGetTxResultByHash,
} from './types';

export class IndexerRepository implements IIndexerRepository {
  constructor(private rpcClient: RPCClient) {}

  getBlock(height: number): Promise<IndexerResultGetBlock> {
    throw new Error('Method not implemented.');
  }
  getTxResult(minHeight: number, maxHeight: number): Promise<IndexerResultGetTxResult> {
    throw new Error('Method not implemented.');
  }
  getTxResultByHash(hash: string): Promise<IndexerResultGetTxResultByHash> {
    throw new Error('Method not implemented.');
  }
  query<T = any>(query: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
