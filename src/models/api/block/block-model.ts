export interface BlockModel {
  blockHash: string;

  blockHeight: number;

  transactionCount: number;

  blockProposer: string;

  blockProposerLabel: string;

  network: string;

  timestamp: string;

  totalFees: number;
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

  totalFees: number;

  transactionCount: number;
}
