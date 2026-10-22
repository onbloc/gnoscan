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

export function getMessageKind(messageType: string | null | undefined): MessageKind | undefined {
  return messageType ? MESSAGE_KINDS[messageType] : undefined;
}

export interface DappLabel {
  name: string;
  // Image path in gno-token-resource, e.g. "/grc20/images/gno_land_r_gnoswap_gns.svg".
  logo: string;
  url: string;
}

// The dApp of a package path, keyed by its namespace: "gno.land/r/akkadia/beta/abt" -> "r/akkadia".
export function findDapp(
  packagePath: string,
  registry: Readonly<Record<string, DappLabel>> = DAPPS,
): DappLabel | undefined {
  const namespace = stripGnoLandPrefix(packagePath).split("/").slice(0, 2).join("/");
  return registry[namespace];
}

// displayPath is what the line shows; packagePath stays the full path for the realm link.
export type FunctionRealmLabel =
  | { kind: "call"; packagePath: string; displayPath: string; dapp?: DappLabel }
  | { kind: "deploy"; packagePath: string; displayPath: string }
  | { kind: "text"; text: string };

// The line under the Function chip that tells which realm or kind of message the function belongs to.
export function getFunctionRealmLabel(
  messageType: string | null | undefined,
  packagePath: string | null | undefined,
): FunctionRealmLabel | undefined {
  switch (getMessageKind(messageType)) {
    case "call": {
      if (!packagePath) return undefined;
      const path = stripGnoLandPrefix(packagePath);
      const dapp = findDapp(packagePath);
      // The dApp name already stands for the namespace, so only the realm under it is shown:
      // "GnoSwap · gov/governance" instead of "GnoSwap · r/gnoswap/gov/governance".
      const displayPath = dapp ? path.split("/").slice(2).join("/") || path : path;
      return { kind: "call", packagePath, displayPath, dapp };
    }
    case "deploy":
      return packagePath ? { kind: "deploy", packagePath, displayPath: stripGnoLandPrefix(packagePath) } : undefined;
    case "run":
      return { kind: "text", text: "run" };
    case "send":
      return { kind: "text", text: "bank · native" };
    default:
      return undefined;
  }
}
