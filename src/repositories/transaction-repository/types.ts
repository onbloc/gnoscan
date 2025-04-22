/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageInfo, PageOption } from "@/common/clients/indexer-client/types";
import { MonthlyTransactionStatInfo, TotalTransactionStatInfo, Transaction } from "@/types/data-type";

export interface ITransactionRepository {
  getTransactions(minBlockHeight: number, maxBlockHeight: number, pageOption?: PageOption): Promise<Transaction[]>;

  getTransactionsPage(cursor: string | null): Promise<{
    pageInfo: PageInfo;
    transactions: Transaction[];
  } | null>;

  getTransactionStatInfo(): Promise<TotalTransactionStatInfo>;

  getTransactionBlockHeight(transactionHash: string): Promise<number | null>;

  getGRC20ReceivedTransactionsByAddress(address: string, pageOption?: PageOption): Promise<Transaction[] | null>;

  getSimpleTransactionsByFromHeight(height: number): Promise<any[]>;

  getMonthlyTransactionStatInfo(): Promise<MonthlyTransactionStatInfo | null>;
}
