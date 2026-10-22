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
  /** Image path in gno-token-resource, e.g. "/grc20/images/gno_land_r_gnoswap_gns.svg". */
  logo: string;
  url: string;
}

/**
 * Finds the dApp of a package path. A key is a namespace ("r/gnoswap") or a full realm path ("r/gnoland/wugnot") for
 * a namespace shared by unrelated realms, and the longest matching key wins.
 *
 * @param packagePath - Package path with or without the "gno.land/" prefix
 * @param registry - dApp labels by key, the bundled dapps.json by default
 * @returns The matched dApp and `depth`, the number of path segments its key covers
 */
export function findDapp(
  packagePath: string,
  registry: Readonly<Record<string, DappLabel>> = DAPPS,
): { dapp: DappLabel; depth: number } | undefined {
  const segments = stripGnoLandPrefix(packagePath).split("/");
  for (let depth = segments.length; depth >= 2; depth--) {
    const dapp = registry[segments.slice(0, depth).join("/")];
    if (dapp) return { dapp, depth };
  }
  return undefined;
}

/**
 * The line under the Function chip. `displayPath` is what the line shows, while `packagePath` stays the full path for
 * the realm link.
 */
export type FunctionRealmLabel =
  | { kind: "call"; packagePath: string; displayPath: string; dapp?: DappLabel }
  | { kind: "deploy"; packagePath: string; displayPath: string }
  | { kind: "text"; text: string };

/**
 * Builds the line under the Function chip that tells which realm or kind of message the function belongs to.
 *
 * @param messageType - Message type from the API ("/vm.m_call") or a custom network mapper ("MsgCall")
 * @param packagePath - Package path of the message shown in the chip
 * @returns The label, or undefined when the message has no realm or kind to show
 */
export function getFunctionRealmLabel(
  messageType: string | null | undefined,
  packagePath: string | null | undefined,
): FunctionRealmLabel | undefined {
  switch (getMessageKind(messageType)) {
    case "call": {
      if (!packagePath) return undefined;
      const path = stripGnoLandPrefix(packagePath);
      const match = findDapp(packagePath);
      if (!match) return { kind: "call", packagePath, displayPath: path };
      // The dApp name already stands for the key, so only the realm under it is shown:
      // "GnoSwap · gov/governance" instead of "GnoSwap · r/gnoswap/gov/governance".
      const segments = path.split("/");
      const displayPath = segments.slice(match.depth).join("/") || segments[segments.length - 1];
      return { kind: "call", packagePath, displayPath, dapp: match.dapp };
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
