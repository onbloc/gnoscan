import type { BaseTransactionModel } from "@/models/api/transaction/transaction-model";
import { WUGNOT_PACKAGE_PATH } from "@/common/values/constant-value";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import DAPPS from "@/assets/meta/dapps.json";

export const APPROVE_FUNCTION = "Approve";
export const SET_APPROVAL_FOR_ALL_FUNCTION = "SetApprovalForAll";

// GRC20 Approve and GRC721 SetApprovalForAll only grant permission for the action that follows.
export function isApprovalFunction(functionName: string | undefined): boolean {
  return functionName === APPROVE_FUNCTION || functionName === SET_APPROVAL_FOR_ALL_FUNCTION;
}
const WUGNOT_WRAP_FUNCTIONS: Readonly<Record<string, true>> = {
  Deposit: true,
  Withdraw: true,
};

export function isPreparatoryTransactionFunction(packagePath: string, functionName: string): boolean {
  return (
    isApprovalFunction(functionName) ||
    (packagePath === WUGNOT_PACKAGE_PATH && WUGNOT_WRAP_FUNCTIONS[functionName] === true)
  );
}

export function getRepresentativeTransactionFunction(transaction: Pick<BaseTransactionModel, "messageCount" | "func">) {
  const first = transaction.func[0];
  if (transaction.messageCount <= 1) return first;

  return (
    transaction.func.find(func => !isPreparatoryTransactionFunction(func.pkgPath, func.funcType)) ??
    transaction.func.find(func => !isApprovalFunction(func.funcType)) ??
    first
  );
}

export type MessageKind = "call" | "deploy" | "run" | "send";

// The same message type arrives as "/vm.m_call" from the API and as "MsgCall" or "AddPackage" from the custom
// network mappers.
const MESSAGE_KINDS: Readonly<Record<string, MessageKind>> = {
  [MESSAGE_TYPES.VM_CALL]: "call",
  MsgCall: "call",
  [MESSAGE_TYPES.VM_ADDPKG]: "deploy",
  AddPackage: "deploy",
  MsgAddPackage: "deploy",
  [MESSAGE_TYPES.VM_RUN]: "run",
  MsgRun: "run",
  [MESSAGE_TYPES.BANK_MSG_SEND]: "send",
  BankMsgSend: "send",
};

export function getMessageKind(messageType: string): MessageKind | undefined {
  return MESSAGE_KINDS[messageType];
}

export interface DappLabel {
  name: string;
  /** Image path in gno-token-resource, e.g. "/grc20/images/gno_land_r_gnoswap_gns.svg". */
  logo: string;
  /** The dApp's website, opened from the realm path. */
  url: string;
}

/**
 * Finds the dApp of a package path. A key is a namespace ("r/gnoswap") or a full realm path ("r/gnoland/wugnot") for
 * a namespace shared by unrelated realms, and the longest matching key wins.
 *
 * @param packagePath - Package path with or without the "gno.land/" prefix
 * @param registry - dApp labels by key, the bundled dapps.json by default
 * @returns The matched dApp, or undefined when no key matches
 */
export function findDapp(
  packagePath: string,
  registry: Readonly<Record<string, DappLabel>> = DAPPS,
): DappLabel | undefined {
  const segments = stripGnoLandPrefix(packagePath).split("/");
  for (let depth = segments.length; depth >= 2; depth--) {
    const dapp = registry[segments.slice(0, depth).join("/")];
    if (dapp) return dapp;
  }
  return undefined;
}

/** The line under the Function chip: a realm path with the dApp logo when registered, or the kind of message. */
export type FunctionRealmLabel =
  | { kind: "call"; packagePath: string; dapp?: DappLabel }
  | { kind: "deploy"; packagePath: string }
  | { kind: "run"; packagePath: string; moreCount: number }
  | { kind: "text"; text: string };

/**
 * Builds the line under the Function chip that tells which realm or kind of message the function belongs to.
 *
 * @param messageType - Message type from the API ("/vm.m_call") or a custom network mapper ("MsgCall")
 * @param packagePath - Package path of the message shown in the chip, empty when it has none
 * @returns The label, or undefined when the message has no realm or kind to show
 */
export function getFunctionRealmLabel(messageType: string, packagePath: string): FunctionRealmLabel | undefined {
  switch (getMessageKind(messageType)) {
    case "call":
      return packagePath ? { kind: "call", packagePath, dapp: findDapp(packagePath) } : undefined;
    case "deploy":
      return packagePath ? { kind: "deploy", packagePath } : undefined;
    case "run":
      return { kind: "text", text: "run" };
    case "send":
      return { kind: "text", text: "bank · native" };
    default:
      return undefined;
  }
}

/**
 * Lists the realms that the run messages of a transaction called, in call order and without repeats.
 *
 * @param messages - Messages from the transaction contracts API
 * @returns Realm paths, empty when no run message called a realm
 */
export function getRunCalledRealms(
  messages: { messageType: string; calledFunctions?: { packagePath: string }[] | null }[],
): string[] {
  const paths = messages
    .filter(message => getMessageKind(message.messageType) === "run")
    .flatMap(message => message.calledFunctions ?? [])
    .map(calledFunction => calledFunction.packagePath)
    .filter(Boolean);
  return [...new Set(paths)];
}
