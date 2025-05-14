import { Amount } from "@/types/data-type";

export interface TransactionContractModel {
  messageType: string;
  name: string;
  pkgPath: string;
  funcType: string;
  caller: string;
  amount: Amount;
  from: string;
  to: string;
  log: string;

  // Todo
  // pkgName
  // files
  // deposit
  // send
}

export interface GetTransactionContractsResponse {
  items: TransactionContractModel[];

  page: {
    hasNext: boolean;
  };
}
