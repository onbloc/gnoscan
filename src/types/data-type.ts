/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimeStamp } from "@/common/utils/date-util";
import { TxFee, TxSignature } from "@gnolang/tm2-js-client";

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

export interface BlockSummaryInfo {
  timeStamp: TimeStamp;
  network: string;
  blockHeight: number | null;
  blockHeightStr: string | undefined;
  transactions:
    | {
        hash: string;
        messages: any[];
        fee?: TxFee;
        signatures: TxSignature[];
        memo: string;
      }[]
    | undefined;
  numberOfTransactions: string;
  gas: string;
  proposerAddress: string;
  hasPreviousBlock?: boolean;
  hasNextBlock?: boolean;
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

export interface Realm {
  hash: string;
  index: number;
  success: true;
  blockHeight: number;
  packageName: string;
  packagePath: string;
  creator: string;
  functionCount: number;
  totalCalls: number;
  totalGasUsed: {
    value: string;
    denom: string;
  };
}

export interface RealmSummary {
  name: string;
  path: string;
  realmAddress: string;
  publisherAddress: string;
  funcs: string[] | undefined;
  blockPublished: number;
  files:
    | {
        name: string;
        body: string;
      }[]
    | undefined;
  balance: Amount | null;
  contractCalls: null;
  totalUsedFees: null;
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

export interface TransactionContractInfo {
  messages: any[];
  numOfMessage: number;
  rawContent: string;
}

export interface TransactionEvent {
  summary: GnoEvent;
  events: GnoEvent[];
}

export interface TransactionSummaryInfo {
  network: any;
  timeStamp: TimeStamp;
  blockResult: any;
  gas: string;
  transactionItem: Transaction | null;
  transactionEvents: GnoEvent[];
}

export interface NewestRealm {
  hash: string;
  index: number;
  success: boolean;
  blockHeight: number;
  packageName: string;
  packagePath: string;
  creator: string;
  functionCount: number;
  totalCalls: number;
  totalGasUsed: Amount;
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

export interface SummaryGnotSupplyInfo {
  totalSupplyAmount: string;
  airdropSupplyAmount: string;
  airdropHolder: string;
}

export interface SummaryBlockInfo {
  blockHeight: string;
  blockTimeAverage: string;
  txPerBlockAverage: string;
}

export interface SummaryTransactionsInfo {
  totalTransactions: string;
  transactionFeeAverage: string;
  transactionTotalFee: string;
}

export interface SummaryAccountsInfo {
  totalAccounts: number;
  totalUsers: number;
  numOfValidators: string;
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
