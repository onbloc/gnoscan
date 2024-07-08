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

export interface TokenMeta {
  id: string;
  name: string;
  denom?: string;
  pkg_path?: string;
  symbol: string;
  decimals: number;
  chain_id: string;
  description: string;
  website_url: string;
  image: string;
}

export interface TokenInfo {
  name: string;
  denom: string;
  symbol: string;
  decimals: number;
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

export interface GnoEvent {
  id: string;
  transactionHash: string;
  caller: string;
  type: string;
  packagePath: string;
  functionName: string;
  time: string;
  attrs: {
    key: string;
    value: string;
  }[];
}
