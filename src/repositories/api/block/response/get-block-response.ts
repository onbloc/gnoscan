export interface GetBlockResponse {
  blockHash: string;
  blockHeight: number;
  gasUsed: number;
  gasUsedPercentage: number;
  gasWanted: number;
  network: string;
  proposerAddress: string;
  proposerLabel: string;
  timestamp: string;
  totalTransactionCount: number;
}
