import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { Amount } from "@/types/data-type";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface BaseTransactionModel {
  txHash: string;
  blockHeight: number;
  timestamp: string;

  successYn: boolean;
  messageCount: number;

  fromAddress: string;
  fromLabel?: string | null;
  fromLabelType?: ADDRESS_LABEL_TYPE | null;
  toAddress: string;
  toLabel?: string | null;
  toLabelType?: ADDRESS_LABEL_TYPE | null;

  fee: Amount;

  func: {
    messageType: string;
    funcType: string;
    pkgPath: string;
  }[];
}

export interface TransactionModel extends BaseTransactionModel {
  fromName: string;
  toName: string;

  amount: Amount;
}

export interface TransactionContractMessagesProps {
  message: TransactionContractModel;
  isDesktop: boolean;
  files?: { name: string; body: string }[] | null;
  getUrlWithNetwork: (uri: string) => string;
}
