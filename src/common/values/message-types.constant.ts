// Message type constants
export const MESSAGE_TYPES = {
  VM_CALL: "/vm.m_call",
  VM_ADDPKG: "/vm.m_addpkg",
  VM_RUN: "/vm.m_run",
  VM_ENABLE_PKG: "/vm.m_enable_pkg",
  VM_REJECT_PKG: "/vm.m_reject_pkg",
  // onbloc-api-v3 reports package approval messages with these type strings,
  // while the chain amino names are `m_enable_pkg` / `m_reject_pkg` above.
  VM_ENABLE_PACKAGE: "/vm.m_enable_package",
  VM_REJECT_PACKAGE: "/vm.m_reject_package",
  BANK_MSG_SEND: "/bank.MsgSend",
  AUTH_CREATE_SESSION: "/auth.m_create_session",
  AUTH_REVOKE_SESSION: "/auth.m_revoke_session",
  AUTH_REVOKE_ALL_SESSIONS: "/auth.m_revoke_all_sessions",
} as const;

// Function type constants
export const TRANSACTION_FUNCTION_TYPES = {
  TRANSFER: "Transfer",
  ADD_PKG: "AddPkg",
  MSG_RUN: "MsgRun",
  ENABLE_PKG: "EnablePkg",
  REJECT_PKG: "RejectPkg",
  CREATE_SESSION: "CreateSession",
  REVOKE_SESSION: "RevokeSession",
  REVOKE_ALL_SESSIONS: "RevokeAllSessions",
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];
export type TransactionFunctionType = (typeof TRANSACTION_FUNCTION_TYPES)[keyof typeof TRANSACTION_FUNCTION_TYPES];

export const ENABLE_PACKAGE_MESSAGE_TYPES: readonly string[] = [
  MESSAGE_TYPES.VM_ENABLE_PKG,
  MESSAGE_TYPES.VM_ENABLE_PACKAGE,
];
export const REJECT_PACKAGE_MESSAGE_TYPES: readonly string[] = [
  MESSAGE_TYPES.VM_REJECT_PKG,
  MESSAGE_TYPES.VM_REJECT_PACKAGE,
];

export function isEnablePackageMessageType(messageType: string | null | undefined): boolean {
  return !!messageType && ENABLE_PACKAGE_MESSAGE_TYPES.includes(messageType);
}

export function isRejectPackageMessageType(messageType: string | null | undefined): boolean {
  return !!messageType && REJECT_PACKAGE_MESSAGE_TYPES.includes(messageType);
}
