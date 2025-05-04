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

export interface BlockSummaryModel {
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
