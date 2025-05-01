import { GetTransactionsRequestParameters } from "./request";
import { GetTransactionResponse, GetTransactionsResponse, GetTransactionContractsResponse } from "./response";

export interface ApiTransactionRepository {
  getTransactions(params: GetTransactionsRequestParameters): Promise<GetTransactionsResponse>;

  getTransaction(hash: string): Promise<GetTransactionResponse>;

  getTransactionContracts(hash: string): Promise<GetTransactionContractsResponse>;
}
