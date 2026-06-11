// Message type constants
export const MESSAGE_TYPES = {
  VM_CALL: "/vm.m_call",
  VM_ADDPKG: "/vm.m_addpkg",
  VM_RUN: "/vm.m_run",
  BANK_MSG_SEND: "/bank.MsgSend",
  AUTH_CREATE_SESSION: "/auth.MsgCreateSession",
  AUTH_REVOKE_SESSION: "/auth.MsgRevokeSession",
  AUTH_REVOKE_ALL_SESSIONS: "/auth.MsgRevokeAllSessions",
} as const;

// Function type constants
export const TRANSACTION_FUNCTION_TYPES = {
  TRANSFER: "Transfer",
  ADD_PKG: "AddPkg",
  MSG_RUN: "MsgRun",
  CREATE_SESSION: "CreateSession",
  REVOKE_SESSION: "RevokeSession",
  REVOKE_ALL_SESSIONS: "RevokeAllSessions",
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];
export type TransactionFunctionType = (typeof TRANSACTION_FUNCTION_TYPES)[keyof typeof TRANSACTION_FUNCTION_TYPES];
