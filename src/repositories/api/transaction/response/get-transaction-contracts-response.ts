import { Amount } from "@/types/data-type";

// Session-account specific fields of `create_session`, `revoke_session`, and `revoke_all_sessions` messages.
export interface TransactionSession {
  spendLimit: Amount;
  sessionKey: string;
  allowPaths: string[];
  expiresAt: number;
  spendPeriod: number;
}

export interface TransactionContractModel {
  messageType: string;
  name: string;
  pkgName: string;
  pkgPath: string;
  funcType: string;
  caller: string;
  callerName: string;
  creator: string;
  creatorName: string;
  amount: Amount;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  log: string;
  args: string[];
  calledFunctions: { packagePath: string; method: string }[];
  files: string[];
  deposit: Amount;
  maxDeposit: Amount;
  send: Amount;
  session?: TransactionSession;
}

export interface GetTransactionContractsResponse {
  items: TransactionContractModel[];

  page: {
    hasNext: boolean;
    cursor: string;
  };
}
