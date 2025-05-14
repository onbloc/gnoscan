import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { API_MESSAGE_TYPES, TRANSACTION_FUNCTION_TYPES } from "../values/message-types.constant";

export function getTransactionMessageType(message: TransactionContractModel): string {
  const messageTypeMap: Record<string, string> = {
    [API_MESSAGE_TYPES.BANK_MSG_SEND]: TRANSACTION_FUNCTION_TYPES.TRANSFER,
    [API_MESSAGE_TYPES.ADD_PACKAGE]: TRANSACTION_FUNCTION_TYPES.ADD_PKG,
    [API_MESSAGE_TYPES.MSG_RUN]: TRANSACTION_FUNCTION_TYPES.MSG_RUN,
  };

  if (message.messageType === API_MESSAGE_TYPES.MSG_CALL) {
    return message.funcType || message.messageType;
  }

  return messageTypeMap[message.messageType] || message.messageType;
}
