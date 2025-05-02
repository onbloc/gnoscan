export interface TransactionContractModel {
  fields: {
    key: string;
    value: string;
  }[];
  type: string;
}

export interface GetTransactionContractsResponse {
  items: TransactionContractModel[];
}
