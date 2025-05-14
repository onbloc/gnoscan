/**
 * Message type constants used in API responses
 */
export const API_MESSAGE_TYPES = {
  MSG_CALL: "MsgCall",
  ADD_PACKAGE: "AddPackage",
  MSG_RUN: "MsgRun",
  BANK_MSG_SEND: "BankMsgSend",
} as const;

// Message type constants
export const MESSAGE_TYPES = {
  VM_CALL: "/vm.m_call",
  VM_ADDPKG: "/vm.m_addpkg",
  VM_RUN: "/vm.m_run",
  BANK_MSG_SEND: "/bank.MsgSend",
} as const;

// Function type constants
export const TRANSACTION_FUNCTION_TYPES = {
  TRANSFER: "Transfer",
  ADD_PKG: "AddPkg",
  MSG_RUN: "MsgRun",
} as const;

export type MessageTypeFromApi = (typeof API_MESSAGE_TYPES)[keyof typeof API_MESSAGE_TYPES];
export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];
export type TransactionFunctionType = (typeof TRANSACTION_FUNCTION_TYPES)[keyof typeof TRANSACTION_FUNCTION_TYPES];
