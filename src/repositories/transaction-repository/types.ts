import {PageOption} from '@/common/clients/indexer-client/types';
import {Transaction} from '@/types/data-type';

export interface ITransactionRepository {
  getTransactions(
    minBlockHeight: number,
    maxBlockHeight: number,
    pageOption?: PageOption,
  ): Promise<Transaction[]>;

  getTransactionsPage(
    minBlockHeight: number,
    maxBlockHeight: number,
    pageOption: PageOption,
  ): Promise<Transaction[]>;

  getTransactionBlockHeight(transactionHash: string): Promise<number | null>;

  getGRC20ReceivedTransactionsByAddress(
    address: string,
    pageOption?: PageOption,
  ): Promise<Transaction[] | null>;

  getSimpleTransactionsByFromHeight(height: number): Promise<any[]>;
}
