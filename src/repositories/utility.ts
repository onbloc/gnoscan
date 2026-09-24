/* eslint-disable @typescript-eslint/no-explicit-any */
import { APPROVE_FUNCTION, isPreparatoryTransactionFunction } from "@/common/utils/transaction-list.utility";

export function getDefaultMessage<T = any>(
  messages: {
    value: any;
  }[],
  success: boolean,
): T {
  if (success !== true) return messages[0] as T;

  return (messages.find(message => !isPreparatoryTransactionFunction(message.value?.pkg_path, message.value?.func)) ??
    messages.find(message => message.value?.func !== APPROVE_FUNCTION) ??
    messages[0]) as T;
}
export function getDefaultMessageByBlockTransaction<T = any>(messages: any[], success: boolean): T {
  if (success !== true) return messages[0] as T;

  return (messages.find(message => !isPreparatoryTransactionFunction(message?.pkg_path, message?.func)) ??
    messages.find(message => message?.func !== APPROVE_FUNCTION) ??
    messages[0]) as T;
}
