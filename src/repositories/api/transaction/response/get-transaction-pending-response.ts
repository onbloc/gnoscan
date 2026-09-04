export type PendingTransactionStatus = "PENDING" | "UNKNOWN";

export interface GetTransactionPendingResponse {
  status: PendingTransactionStatus;
  rawTx?: string;
}
