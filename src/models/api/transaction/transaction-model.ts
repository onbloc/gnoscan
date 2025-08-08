import { StorageDeposit } from "@/models/storage-deposit-model";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { Amount } from "@/types/data-type";

export interface BaseTransactionModel {
  txHash: string;
  blockHeight: number;
  timestamp: string;

  successYn: boolean;
  messageCount: number;

  fromAddress: string;
  toAddress: string;

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
  getUrlWithNetwork: (uri: string) => string;
  storageDepositInfo?: StorageDeposit | null;
}
