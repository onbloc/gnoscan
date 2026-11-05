import { ApiTransactionRepository } from "./api-transaction-repository";

import {
  GetTransactionContractsRequest,
  GetTransactionEventsRequest,
  GetTransactionFunctionNamesRequestParameters,
  GetTransactionsRequestParameters,
} from "./request";
import {
  GetTransactionsResponse,
  GetTransactionResponse,
  GetTransactionPendingResponse,
  GetTransactionContractsResponse,
  GetTransactionEventsResponse,
  GetTransactionFunctionNamesResponse,
} from "./response";
import { ApiRepository } from "../api-repository";
import { encodeQueryValue, makeQueryParameter, makeRepeatedQueryParameter } from "@/common/utils/string-util";

export class ApiTransactionRepositoryImpl extends ApiRepository implements ApiTransactionRepository {
  getTransactions(params: GetTransactionsRequestParameters): Promise<GetTransactionsResponse> {
    // `function` and `excludeFunction` repeat once per label, which makeQueryParameter cannot send.
    const { function: included, excludeFunction: excluded, ...rest } = params;
    const query = [
      makeQueryParameter(rest).slice(1),
      ...makeRepeatedQueryParameter("function", included),
      ...makeRepeatedQueryParameter("excludeFunction", excluded),
    ]
      .filter(Boolean)
      .join("&");

    return this.get<GetTransactionsResponse>(query ? `transactions?${query}` : "transactions");
  }

  getTransactionFunctionNames(
    params: GetTransactionFunctionNamesRequestParameters,
  ): Promise<GetTransactionFunctionNamesResponse> {
    return this.get<GetTransactionFunctionNamesResponse>("transactions/functions", {
      keyword: encodeQueryValue(params.keyword),
    });
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
