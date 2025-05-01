import { GetTransactionsRequestParameters } from "./request";
import { GetTransactionsResponse } from "./response";

export interface ApiTransactionRepository {
  getTransactions(params: GetTransactionsRequestParameters): Promise<GetTransactionsResponse>;
}
