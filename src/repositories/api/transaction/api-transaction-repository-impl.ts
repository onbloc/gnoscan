import { ApiTransactionRepository } from "./api-transaction-repository";

import {
  GetTransactionContractsRequest,
  GetTransactionEventsRequest,
  GetTransactionsRequestParameters,
} from "./request";
import {
  GetTransactionsResponse,
  GetTransactionResponse,
  GetTransactionPendingResponse,
  GetTransactionContractsResponse,
  GetTransactionEventsResponse,
} from "./response";
import { ApiRepository } from "../api-repository";

export class ApiTransactionRepositoryImpl extends ApiRepository implements ApiTransactionRepository {
  getTransactions(params: GetTransactionsRequestParameters): Promise<GetTransactionsResponse> {
    return this.get<GetTransactionsResponse>("transactions", { ...params });
  }

  getTransaction(hash: string): Promise<GetTransactionResponse> {
    return this.get<GetTransactionResponse>(`transactions/${encodeURIComponent(hash)}`);
  }

  getTransactionPending(hash: string): Promise<GetTransactionPendingResponse> {
    return this.get<GetTransactionPendingResponse>(`transactions/${encodeURIComponent(hash)}/pending`);
  }

  getTransactionContracts(params: GetTransactionContractsRequest): Promise<GetTransactionContractsResponse> {
    const { txHash, ...queryParams } = params;
    return this.get<GetTransactionContractsResponse>(
      `transactions/${encodeURIComponent(txHash)}/contracts`,
      queryParams,
    );
  }

  getTransactionEvents(params: GetTransactionEventsRequest): Promise<GetTransactionEventsResponse> {
    const { txHash, ...queryParams } = params;
    return this.get<GetTransactionEventsResponse>(`transactions/${encodeURIComponent(txHash)}/events`, queryParams);
  }
}
