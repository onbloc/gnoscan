export interface BlockModel {
  blockHash: string;

  blockHeight: number;

  totalTransactionCount: number;

  blockProposer: string;

  blockProposerLabel: string;

  network: string;

  timestamp: string;

  totalFees: number;

  createdAt: string;
}
