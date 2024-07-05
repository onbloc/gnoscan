export interface Block {
  hash: string;
  height: number;
  time: string;
  numTxs: number;
  proposer: string;
  proposerRaw: string;
  totalFees: Amount | null;
}

export interface Amount {
  value: string;
  denom: string;
}

export interface ValueWithDenomType {
  value: string;
  denom: string;
}

export interface Transaction {
  hash: string;
  success: boolean;
  numOfMessage: number;
  type: string;
  packagePath: string;
  functionName: string;
  blockHeight: number;
  from: string;
  to?: string;
  amount: Amount;
  time: string;
  fee: Amount;
  gasUsed?: Amount;
  memo?: string;
  rawContent?: string;
  messages?: any[];
}
