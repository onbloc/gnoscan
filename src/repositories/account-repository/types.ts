import {PageOption} from '@/common/clients/indexer-client/types';
import {Transaction} from '@/types/data-type';

export interface IAccountRepository {
  getNativeTokensBalances(address: string): Promise<any>;
  getGRC20TokensBalances(address: string, tokenPaths: string[]): Promise<any>;
  getTransactions(minBlockHeight: number, maxBlockHeight: number): Promise<Transaction[]>;
  getTransactionsByPagination(pageOption: PageOption): Promise<Transaction[]>;
  getGRC20ReceivedTransactionsByAddress(address: string): Promise<Transaction[] | null>;
  getNativeTokenSendTransactionsByAddress(address: string): Promise<Transaction[] | null>;
  getNativeTokenReceivedTransactionsByAddress(address: string): Promise<Transaction[] | null>;
  getVMTransactionsByAddress(address: string): Promise<Transaction[] | null>;
}
