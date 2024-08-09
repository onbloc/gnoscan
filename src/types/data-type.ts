export interface Board {
  index: number;
  path: string;
  name: string;
}

export interface Blog {
  index: number;
  title: string;
  path: string;
  date: string;
}

export interface BlogDetail {
  index: number;
  title: string;
  path: string;
  date: string;
}

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
  amountOut?: Amount;
  time: string;
  fee: Amount;
  gasUsed?: Amount;
  memo?: string;
  rawContent?: string;
  messages?: any[];
  events?: GnoEvent[];
}

export interface TransactionEvent {
  summary: GnoEvent;
  events: GnoEvent[];
}

export interface GnoEvent {
  id: string;
  blockHeight: number;
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

export interface TotalTransactionStatInfo {
  accounts: number;
  gasFee: number;
}

export interface MonthlyTransactionStatInfo {
  accounts: MonthlyAccountTransaction[];
  dailyTransactionInfo: Record<string, MonthlyDailyTransaction>;
  realmGasSharedInfoOfMonth: Record<string, Record<string, MonthlyRealmGasShared>>;
  realmGasSharedInfoOfWeek: Record<string, Record<string, MonthlyRealmGasShared>>;
  bestRealmsOfMonth: MonthlyRealmGasShared[];
  bestRealmsOfWeek: MonthlyRealmGasShared[];
}

export interface MonthlyAccountTransaction {
  account: string;
  totalTransaction: number;
  nonTransferTransaction: number;
}

export interface MonthlyDailyTransaction {
  totalGasFee: number;
  txCount: number;
}

export interface MonthlyRealmGasShared {
  packagePath: string;
  gasShared: number;
}
