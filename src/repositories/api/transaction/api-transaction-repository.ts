import {
  GetTransactionContractsRequest,
  GetTransactionEventsRequest,
  GetTransactionFunctionNamesRequestParameters,
  GetTransactionsRequestParameters,
} from "./request";
import {
  GetTransactionResponse,
  GetTransactionsResponse,
  GetTransactionPendingResponse,
  GetTransactionContractsResponse,
  GetTransactionEventsResponse,
  GetTransactionFunctionNamesResponse,
} from "./response";

export interface ApiTransactionRepository {
  getTransactions(params: GetTransactionsRequestParameters): Promise<GetTransactionsResponse>;

  getTransactionFunctionNames(
    params: GetTransactionFunctionNamesRequestParameters,
  ): Promise<GetTransactionFunctionNamesResponse>;

  getTransaction(hash: string): Promise<GetTransactionResponse>;

  getTransactionPending(hash: string): Promise<GetTransactionPendingResponse>;

  getTransactionContracts(params: GetTransactionContractsRequest): Promise<GetTransactionContractsResponse>;

  getTransactionEvents(params: GetTransactionEventsRequest): Promise<GetTransactionEventsResponse>;
}
