export interface BlockDetailsModel {
  timestamp: string;
  dateDiff: string;
  network: string;
  height: number;
  txs: number;
  gas: string;
  proposer: string;
  address: string;
  prev: boolean;
  next: boolean;
}
