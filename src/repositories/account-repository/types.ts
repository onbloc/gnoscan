import {Transaction} from '@/types/data-type';

export interface IAccountRepository {
  getNativeTokensBalances(address: string): Promise<any>;
  getGRC20TokensBalances(address: string, tokenPaths: string[]): Promise<any>;
  getAccountTransactions(
    address: string,
    cursor: string | null,
  ): Promise<AccountTransactionResponse>;
  getGRC20ReceivedTransactionsByAddress(address: string): Promise<Transaction[] | null>;
  getNativeTokenSendTransactionsByAddress(address: string): Promise<Transaction[] | null>;
  getNativeTokenReceivedTransactionsByAddress(address: string): Promise<Transaction[] | null>;
  getVMTransactionsByAddress(address: string): Promise<Transaction[] | null>;
}

export interface AccountTransactionResponse {
  transactions: Transaction[];
  pageInfo: {
    last: string | null;
    hasNext: boolean;
  };
}
