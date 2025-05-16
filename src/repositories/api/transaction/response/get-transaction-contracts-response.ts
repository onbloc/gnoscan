import { Amount } from "@/types/data-type";

export interface TransactionContractModel {
  messageType: string;
  name: string;
  pkgName: string;
  pkgPath: string;
  funcType: string;
  caller: string;
  creator: string;
  amount: Amount;
  from: string;
  to: string;
  log: string;
  args: string[];
  calledFunctions: { packagePath: string; method: string }[];
  files: string[];
  deposit: Amount;
  send: Amount;
}

export interface GetTransactionContractsResponse {
  items: TransactionContractModel[];

  page: {
    hasNext: boolean;
    cursor: string;
  };
}
