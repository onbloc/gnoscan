import type { BaseTransactionModel } from "@/models/api/transaction/transaction-model";
import type { TransactionContractModel } from "@/repositories/api/transaction/response";
import { GNO_TOKEN_RESOURCE_BASE_URI, WUGNOT_PACKAGE_PATH } from "@/common/values/constant-value";
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
  /** Image URL, or a path under public/ such as "/images/dapps/kourt.svg". */
  logo: string;
  /** The dApp's website, opened from the logo. The logo is not a link without it. */
  url?: string;
}

// Namespaces shared by unrelated realms. A token there does not stand for a dApp, so these realms are labeled in
// dapps.json.
const SHARED_NAMESPACES: Readonly<Record<string, true>> = {
  "r/demo": true,
  "r/gnoland": true,
  "r/sys": true,
};

// Compares websites without the scheme, "www." and trailing slashes. The path is kept, so two realms on gno.land do not
// match.
function normalizeWebsite(url: string | undefined): string {
  if (!url) return "";
  try {
    const { host, pathname } = new URL(url);
    return `${host.replace(/^www\./, "")}${pathname}`.replace(/\/+$/, "").toLowerCase();
  } catch {
    return "";
  }
}

/**
 * Builds dApp labels from the gno-token-resource lists. Each entry labels its namespace, or its first realm under an
 * address namespace ("r/g1.../gnomi"), and also every dapps.json key
 * its path falls under or whose website is the same, so a project that registers in gno-token-resource ties with its
 * dapps.json entry and wins. A key with several entries takes the shortest path, then the first one listed, so
 * "r/gnoswap/gns" stands for GnoSwap over "r/gnoswap/test_token/foo".
 *
 * @param entries - GRC20 and GRC721 entries of gno-token-resource, in list order
 * @param manualDapps - dApp labels by key, the bundled dapps.json by default
 * @returns dApp labels by key, leaving out shared namespaces that dapps.json does not name and entries without an image
 */
export function buildTokenResourceDapps(
  entries: readonly { pkg_path?: string; name: string; image: string; website_url: string }[],
  manualDapps: Readonly<Record<string, DappLabel>> = DAPPS,
): Record<string, DappLabel> {
  const manualKeysByWebsite: Record<string, string[]> = {};
  for (const [key, dapp] of Object.entries(manualDapps)) {
    const website = normalizeWebsite(dapp.url);
    if (website) (manualKeysByWebsite[website] ??= []).push(key);
  }

  const dapps: Record<string, DappLabel> = {};
  const depths: Record<string, number> = {};
  for (const entry of entries) {
    if (!entry.pkg_path || !entry.image) continue;
    const segments = stripGnoLandPrefix(entry.pkg_path).split("/");
    // The namespace comes first, then each longer path.
    const prefixes = segments.slice(1).map((_, index) => segments.slice(0, index + 2).join("/"));
    // One address can deploy unrelated apps, so an entry there labels its first realm instead of the whole address.
    const ownIndex = segments[1].startsWith("g1") ? 1 : 0;
    const keys = prefixes
      .filter((key, index) => manualDapps[key] || (index === ownIndex && !SHARED_NAMESPACES[key]))
      .concat(manualKeysByWebsite[normalizeWebsite(entry.website_url)] ?? []);

    for (const key of keys) {
      if (depths[key] <= segments.length) continue;
      depths[key] = segments.length;
      dapps[key] = {
        name: entry.name,
        logo: `${GNO_TOKEN_RESOURCE_BASE_URI}${entry.image}`,
        url: entry.website_url || undefined,
      };
    }
  }
  return dapps;
}

/**
 * Finds the dApp of a package path. A key is a namespace ("r/gnoswap") or a realm path ("r/gnoland/wugnot") for a
 * namespace shared by unrelated apps. The longest matching key wins, and the earlier registry wins a tie.
 *
 * @param packagePath - Package path with or without the "gno.land/" prefix
 * @param registries - dApp labels by key in priority order, the bundled dapps.json by default
 * @returns The matched dApp, or undefined when no key matches
 */
export function findDapp(
  packagePath: string,
  ...registries: Readonly<Record<string, DappLabel>>[]
): DappLabel | undefined {
  if (registries.length === 0) registries = [DAPPS];
  const segments = stripGnoLandPrefix(packagePath).split("/");
  for (let depth = segments.length; depth >= 2; depth--) {
    const key = segments.slice(0, depth).join("/");
    for (const registry of registries) {
      if (registry[key]) return registry[key];
    }
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
 * A dApp comes from the longest matching key in gno-token-resource or dapps.json, with gno-token-resource winning a
 * tie, and is left out when neither has it.
 *
 * @param messageType - Message type from the API ("/vm.m_call") or a custom network mapper ("MsgCall")
 * @param packagePath - Package path of the message shown in the chip, empty when it has none
 * @param tokenResourceDapps - dApp labels built by {@link buildTokenResourceDapps}, empty until the lists load
 * @returns The label, or undefined when the message has no realm or kind to show
 */
export function getFunctionRealmLabel(
  messageType: string,
  packagePath: string,
  tokenResourceDapps: Readonly<Record<string, DappLabel>> = {},
): FunctionRealmLabel | undefined {
  switch (getMessageKind(messageType)) {
    case "call":
      return packagePath
        ? { kind: "call", packagePath, dapp: findDapp(packagePath, tokenResourceDapps, DAPPS) }
        : undefined;
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
  messages: Pick<TransactionContractModel, "messageType" | "calledFunctions">[],
): string[] {
  const paths = messages
    .filter(message => getMessageKind(message.messageType) === "run")
    .flatMap(message => message.calledFunctions ?? [])
    .map(calledFunction => calledFunction.packagePath)
    .filter(Boolean);
  return [...new Set(paths)];
}
