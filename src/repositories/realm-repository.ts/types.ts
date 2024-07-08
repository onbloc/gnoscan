import {Amount} from '@/types/data-type';
import {TransactionWithEvent} from '../response/transaction.types';

export interface IRealmRepository {
  getRealms(): Promise<any | null>;

  getRealm(realmPath: string): Promise<RealmTransaction | null>;

  getRealmFunctions(realmPath: string): Promise<RealmFunction[] | null>;

  getRealmTransactions(realmPath: string): Promise<TransactionWithEvent[] | null>;

  getRealmTransactionsWithArgs(realmPath: string): Promise<RealmTransaction[] | null>;

  getRealmTransactionInfos(): Promise<{[key in string]: RealmTransactionInfo} | null>;

  getRealmBalance(realmPath: string): Promise<Amount | null>;

  getTokens(): Promise<GRC20Info[] | null>;

  getToken(tokenPath: string): Promise<{
    realmTransaction: RealmTransaction<AddPackageValue>;
    tokenInfo: GRC20Info;
  } | null>;

  getUsernames(): Promise<{[key in string]: string}>;
}

export interface RealmFunction {
  functionName: string;
  params: {
    name: string;
    type: string;
    value: string;
  }[];
  results: {
    name: string;
    type: string;
    value: string;
  }[];
}

export interface RealmTransactionInfo {
  msgCallCount: number;
  gasUsed: number;
}

export interface RealmTransaction<T = MsgCallValue | AddPackageValue> {
  hash: string;
  index: number;
  success: boolean;
  block_height: number;
  balance?: Amount | null;
  gas_wanted: number;
  gas_used: number;
  gas_fee: {
    amount: number;
    denom: string;
  };
  messages: {
    value: T;
  }[];
}

export interface MsgCallValue {
  __typename: string;
  caller?: string;
  send?: string;
  pkg_path?: string;
  func?: string;
  args?: string[];
}

export interface AddPackageValue {
  __typename: string;
  creator?: string;
  deposit?: string;
  package?: Package;
}

export interface Package {
  name: string;
  path: string;
  files?: {
    name: string;
    body: string;
  }[];
}

export interface GRC20Info {
  packagePath: string;
  owner: string;
  name: string;
  symbol: string;
  decimals: number;
  functions: string[];
  totalSupply: number;
  holders: number;
}
