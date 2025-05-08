import { Amount } from "@/types/data-type";

export interface TransactionContractModel {
  fields: {
    key: string;
    value: string;
  }[];
  type: string;
  log: string;

  messageType: string;
  name: string;
  pkgPath: string;
  funcType: string;
  caller: string;
  amount: Amount;
  from: string;
  to: string;
}

export interface GetTransactionContractsResponse {
  items: TransactionContractModel[];

  page: {
    hasNext: boolean;
  };
}
