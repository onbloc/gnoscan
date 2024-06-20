export interface IIndexerRepository {
  getBlock(height: number): Promise<IndexerResultGetBlock>;

  getTxResult(minHeight: number, maxHeight: number): Promise<IndexerResultGetTxResult>;

  getTxResultByHash(hash: string): Promise<IndexerResultGetTxResultByHash>;

  query<T = any>(query: string): Promise<T>;
}

export interface IndexerResultGetBlock {}

export interface IndexerResultGetTxResult {}

export interface IndexerResultGetTxResultByHash {}
