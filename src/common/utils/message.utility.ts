import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { MESSAGE_TYPES, TRANSACTION_FUNCTION_TYPES } from "../values/message-types.constant";

export function getTransactionMessageType(message: TransactionContractModel): string {
  const messageTypeMap: Record<string, string> = {
    [MESSAGE_TYPES.BANK_MSG_SEND]: TRANSACTION_FUNCTION_TYPES.TRANSFER,
    [MESSAGE_TYPES.VM_ADDPKG]: TRANSACTION_FUNCTION_TYPES.ADD_PKG,
    [MESSAGE_TYPES.VM_RUN]: TRANSACTION_FUNCTION_TYPES.MSG_RUN,
    [MESSAGE_TYPES.AUTH_CREATE_SESSION]: TRANSACTION_FUNCTION_TYPES.CREATE_SESSION,
    [MESSAGE_TYPES.AUTH_REVOKE_SESSION]: TRANSACTION_FUNCTION_TYPES.REVOKE_SESSION,
    [MESSAGE_TYPES.AUTH_REVOKE_ALL_SESSIONS]: TRANSACTION_FUNCTION_TYPES.REVOKE_ALL_SESSIONS,
    [MESSAGE_TYPES.VM_ENABLE_PKG]: TRANSACTION_FUNCTION_TYPES.ENABLE_PKG,
    [MESSAGE_TYPES.VM_ENABLE_PACKAGE]: TRANSACTION_FUNCTION_TYPES.ENABLE_PKG,
    [MESSAGE_TYPES.VM_REJECT_PKG]: TRANSACTION_FUNCTION_TYPES.REJECT_PKG,
    [MESSAGE_TYPES.VM_REJECT_PACKAGE]: TRANSACTION_FUNCTION_TYPES.REJECT_PKG,
  };

  if (message.messageType === MESSAGE_TYPES.VM_CALL) {
    return message.funcType || message.messageType;
  }

  return messageTypeMap[message.messageType] || message.messageType;
}

// Caller with its label, from the first present of caller / from / creator.
export function getSummaryCaller(message: TransactionContractModel): {
  address: string;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
} {
  if (message.caller)
    return { address: message.caller, label: message.callerLabel, labelType: message.callerLabelType };
  if (message.from) return { address: message.from, label: message.fromLabel, labelType: message.fromLabelType };
  if (message.creator) {
    return { address: message.creator, label: message.creatorLabel, labelType: message.creatorLabelType };
  }
  return { address: "" };
}
