import {Transaction} from '@/types/data-type';

export interface ITransactionRepository {
  getTransactions(minBlockHeight: number, maxBlockHeight: number): Promise<Transaction[]>;

  getTransactionBlockHeight(transactionHash: string): Promise<number | null>;

  getGRC20ReceivedTransactionsByAddress(address: string): Promise<Transaction[] | null>;
}
