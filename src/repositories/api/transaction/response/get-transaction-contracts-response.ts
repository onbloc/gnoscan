export interface TransactionContractModel {
  fields: {
    key: string;
    value: string;
  }[];
  type: string;
  log: string;
}

export interface GetTransactionContractsResponse {
  items: TransactionContractModel[];

  page: {
    hasNext: boolean;
  };
}
