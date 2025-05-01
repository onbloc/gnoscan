import { GetTransactionsRequestParameters } from "./request";
import { GetTransactionResponse, GetTransactionsResponse } from "./response";

export interface ApiTransactionRepository {
  getTransactions(params: GetTransactionsRequestParameters): Promise<GetTransactionsResponse>;

  getTransaction(hash: string): Promise<GetTransactionResponse>;
}
