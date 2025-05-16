import {
  GetTransactionContractsRequest,
  GetTransactionEventsRequest,
  GetTransactionsRequestParameters,
} from "./request";
import {
  GetTransactionResponse,
  GetTransactionsResponse,
  GetTransactionContractsResponse,
  GetTransactionEventsResponse,
} from "./response";

export interface ApiTransactionRepository {
  getTransactions(params: GetTransactionsRequestParameters): Promise<GetTransactionsResponse>;

  getTransaction(hash: string): Promise<GetTransactionResponse>;

  getTransactionContracts(params: GetTransactionContractsRequest): Promise<GetTransactionContractsResponse>;

  getTransactionEvents(params: GetTransactionEventsRequest): Promise<GetTransactionEventsResponse>;
}
