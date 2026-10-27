import {
  GetTransactionContractsRequest,
  GetTransactionEventsRequest,
  GetTransactionsRequestParameters,
} from "./request";
import {
  GetTransactionResponse,
  GetTransactionsResponse,
  GetTransactionPendingResponse,
  GetTransactionContractsResponse,
  GetTransactionEventsResponse,
  GetFunctionNamesResponse,
} from "./response";

export interface ApiTransactionRepository {
  getTransactions(params: GetTransactionsRequestParameters): Promise<GetTransactionsResponse>;

  getTransaction(hash: string): Promise<GetTransactionResponse>;

  getTransactionPending(hash: string): Promise<GetTransactionPendingResponse>;

  getTransactionContracts(params: GetTransactionContractsRequest): Promise<GetTransactionContractsResponse>;

  getTransactionEvents(params: GetTransactionEventsRequest): Promise<GetTransactionEventsResponse>;

  // Called function names, most called first. With an address, only the functions it called.
  getFunctionNames(address?: string): Promise<GetFunctionNamesResponse>;
}
