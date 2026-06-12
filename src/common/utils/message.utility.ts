import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES, TRANSACTION_FUNCTION_TYPES } from "../values/message-types.constant";

export function getTransactionMessageType(message: TransactionContractModel): string {
  const messageTypeMap: Record<string, string> = {
    [MESSAGE_TYPES.BANK_MSG_SEND]: TRANSACTION_FUNCTION_TYPES.TRANSFER,
    [MESSAGE_TYPES.VM_ADDPKG]: TRANSACTION_FUNCTION_TYPES.ADD_PKG,
    [MESSAGE_TYPES.VM_RUN]: TRANSACTION_FUNCTION_TYPES.MSG_RUN,
    [MESSAGE_TYPES.AUTH_CREATE_SESSION]: TRANSACTION_FUNCTION_TYPES.CREATE_SESSION,
    [MESSAGE_TYPES.AUTH_REVOKE_SESSION]: TRANSACTION_FUNCTION_TYPES.REVOKE_SESSION,
    [MESSAGE_TYPES.AUTH_REVOKE_ALL_SESSIONS]: TRANSACTION_FUNCTION_TYPES.REVOKE_ALL_SESSIONS,
  };

  if (message.messageType === MESSAGE_TYPES.VM_CALL) {
    return message.funcType || message.messageType;
  }

  return messageTypeMap[message.messageType] || message.messageType;
}
