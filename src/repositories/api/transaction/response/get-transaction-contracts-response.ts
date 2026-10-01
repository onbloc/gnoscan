import { Amount } from "@/types/data-type";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

// Session-account specific fields of `create_session`, `revoke_session`, and `revoke_all_sessions` messages.
export interface TransactionSession {
  spendLimit: Amount | null;
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
  callerLabel?: string | null;
  callerLabelType?: ADDRESS_LABEL_TYPE | null;
  creator: string;
  creatorName: string;
  creatorLabel?: string | null;
  creatorLabelType?: ADDRESS_LABEL_TYPE | null;
  amount: Amount;
  from: string;
  fromName: string;
  fromLabel?: string | null;
  fromLabelType?: ADDRESS_LABEL_TYPE | null;
  to: string;
  toName: string;
  toLabel?: string | null;
  toLabelType?: ADDRESS_LABEL_TYPE | null;
  log: string;
  args: string[];
  calledFunctions: { packagePath: string; method: string }[];
  files: string[];
  deposit: Amount;
  maxDeposit: Amount;
  send: Amount;
  session?: TransactionSession | null;
}

export interface GetTransactionContractsResponse {
  items: TransactionContractModel[];

  page: {
    hasNext: boolean;
    cursor: string;
  };
}
