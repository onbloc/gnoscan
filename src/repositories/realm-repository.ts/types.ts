import {Amount, Blog, BlogDetail} from '@/types/data-type';
import {TransactionWithEvent} from '../response/transaction.types';
import {PageInfo, PageOption} from '@/common/clients/indexer-client/types';

export interface IRealmRepository {
  getLatestRealms(): Promise<any | null>;

  getRealms(pageOption?: PageOption): Promise<any | null>;

  getRealm(realmPath: string): Promise<RealmTransaction | null>;

  getRealmPackages(cursor: string | null): Promise<{
    pageInfo: PageInfo;
    transactions: RealmTransaction<AddPackageValue>[];
  } | null>;

  getRealmFunctions(realmPath: string): Promise<RealmFunction[] | null>;

  getRealmTransactions(
    realmPath: string,
    pageOption?: PageOption,
  ): Promise<TransactionWithEvent[] | null>;

  getRealmTransactionsWithArgs(
    realmPath: string,
    pageOption?: PageOption,
  ): Promise<RealmTransaction[] | null>;

  getRealmCallTransactionsWithArgs(
    realmPath: string,
    pageOption?: PageOption,
  ): Promise<RealmTransaction<MsgCallValue>[] | null>;

  getTokenHolders(realmPath: string): Promise<number>;

  getRealmTotalSupply(realmPath: string): Promise<number | null>;

  getRealmTransactionInfos(): Promise<{[key in string]: RealmTransactionInfo} | null>;

  getRealmTransactionInfo(packagePath: string): Promise<RealmTransactionInfo | null>;

  getRealmBalance(realmPath: string): Promise<Amount | null>;

  getTokens(): Promise<GRC20Info[] | null>;

  getToken(tokenPath: string): Promise<{
    realmTransaction: RealmTransaction<AddPackageValue>;
    tokenInfo: GRC20Info;
  } | null>;

  getUsernames(): Promise<{[key in string]: string}>;

  getBlogs(): Promise<Blog[]>;

  getBlogPublisher(path: string): Promise<string | null>;
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
