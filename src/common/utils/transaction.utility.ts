/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorageDeposit } from "@/models/storage-deposit-model";
import { GnoEvent } from "@/types";
import { decodeTxMessages, MsgAddPackage, MsgCall, MsgRun, MsgSend } from "@gnolang/gno-js-client";
import { base64ToUint8Array, Tx } from "@gnolang/tm2-js-client";
import crypto from "crypto";
import { GNOTToken } from "../hooks/common/use-token-meta";
import { parseTokenAmount } from "./token.utility";
export function decodeTransaction(tx: string) {
  const txBytes = base64ToUint8Array(tx);
  const hash = makeHash(txBytes);
  const decodedTx = Tx.decode(txBytes);
  const messages = decodeTxMessages(decodedTx.messages) as any[];
  return {
    ...decodedTx,
    hash,
    messages,
  };
}

const HASH_BYTE_LENGTH = 32;

/**
 * Reports whether the given string is a hex-encoded 32-byte (SHA256-size) hash.
 * Mirrors the backend's `utils.IsHexHash` (see onbloc-api-v3 PR #213).
 */
export function isHexHash(hash: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(hash);
}

/**
 * Reports whether the given string is a base64-encoded 32-byte (SHA256-size) hash.
 * Mirrors the backend's `utils.IsBase64Hash` (see onbloc-api-v3 PR #213).
 */
export function isBase64Hash(hash: string): boolean {
  if (!/^[0-9a-zA-Z+/]{43}=$/.test(hash)) {
    return false;
  }
  try {
    return Buffer.from(hash, "base64").length === HASH_BYTE_LENGTH;
  } catch {
    return false;
  }
}

/**
 * Converts a hex-encoded hash to base64. Assumes hex is a valid 32-byte hash.
 */
export function hexHashToBase64(hex: string): string {
  return Buffer.from(hex, "hex").toString("base64");
}

/**
 * Converts a base64-encoded hash to hex. Assumes base64 is a valid 32-byte hash.
 */
export function base64HashToHex(base64: string): string {
  return Buffer.from(base64, "base64").toString("hex");
}

/**
 * Normalizes a hash to base64, accepting either hex or base64 input.
 * Use before comparing against/querying an RPC node directly (tm2 wire format is base64).
 * Falls back to a best-effort base64 round-trip for anything that doesn't strictly
 * match either format, to avoid throwing on unexpected input.
 */
export function makeSafeBase64Hash(data: string) {
  if (isHexHash(data)) {
    return hexHashToBase64(data);
  }
  if (isBase64Hash(data)) {
    return data;
  }
  try {
    return Buffer.from(data, "base64").toString("base64");
  } catch {
    return data;
  }
}

/**
 * Reports whether the given string is a transaction/block hash, in either
 * hex or base64 form. The backend now accepts and returns both (see
 * onbloc-api-v3 PR #213), so search-keyword detection must recognize both.
 */
export function isHash(hash: string): boolean {
  try {
    return isHexHash(hash) || isBase64Hash(hash);
  } catch {
    return false;
  }
}

/**
 * Uppercases a hash for display when it's hex (matching Tendermint/Cosmos
 * convention). Base64 hashes are returned unchanged since base64 is
 * case-sensitive and uppercasing it would corrupt the value.
 */
export function toDisplayHash(hash: string): string {
  return isHexHash(hash) ? hash.toUpperCase() : hash;
}

export function makeHash(bytes: Uint8Array) {
  return crypto.createHash("sha256").setEncoding("utf-8").update(bytes).digest("base64");
}

/**
 * Converts a base64-encoded hash to hex.
 * Use when calling the tx endpoint of an RPC.
 */
export function makeHexByBase64(base64Hash: string) {
  const buffer = Buffer.from(base64Hash, "base64");
  return "0x" + buffer.toString("hex");
}

export function makeTransactionMessageInfo(message: any) {
  switch (message["@type"]) {
    case "/vm.m_call": {
      const msg = message as MsgCall;
      if (msg.func === "Transfer") {
        const msgArgs = msg?.args || [];

        return {
          type: message["@type"],
          packagePath: msg.pkg_path,
          functionName: msg.func,
          from: msg.caller,
          to: msgArgs.length > 0 ? msgArgs[0] : "",
          amount: {
            value: message.args.length > 1 ? message.args[1] : "0",
            denom: msg.pkg_path,
          },
        };
      }
      const amountValue = parseTokenAmount(msg.send);
      const maxDepositValue = parseTokenAmount(msg.max_deposit);

      return {
        type: message["@type"],
        packagePath: msg.pkg_path,
        functionName: msg.func,
        from: msg.caller,
        amount: {
          value: amountValue,
          denom: GNOTToken.denom,
        },
        max_deposit: {
          value: maxDepositValue,
          denom: GNOTToken.denom,
        },
      };
    }
    case "/vm.m_addpkg": {
      const msg = message as MsgAddPackage;

      const maxDepositValue = parseTokenAmount(msg.max_deposit);

      return {
        type: message["@type"],
        packagePath: msg?.package?.path || "",
        functionName: "AddPkg",
        from: msg.creator,
        amount: {
          value: "0",
          denom: GNOTToken.denom,
        },
        max_deposit: {
          value: maxDepositValue,
          denom: GNOTToken.denom,
        },
      };
    }
    case "/vm.m_run": {
      const msg = message as MsgRun;

      const maxDepositValue = parseTokenAmount(msg.max_deposit);

      return {
        type: message["@type"],
        packagePath: msg?.package?.path || "",
        functionName: "MsgRun",
        from: msg.caller,
        amount: {
          value: "0",
          denom: GNOTToken.denom,
        },
        max_deposit: {
          value: maxDepositValue,
          denom: GNOTToken.denom,
        },
      };
    }
    case "/bank.MsgSend": {
      const msg = message as MsgSend;
      const amountValue = parseTokenAmount(msg.amount);

      return {
        type: message["@type"],
        packagePath: "/bank.MsgSend",
        functionName: "Transfer",
        from: msg.from_address,
        to: msg.to_address,
        amount: {
          value: amountValue,
          denom: GNOTToken.denom,
        },
      };
    }
    default:
      return null;
  }
}

/**
 * Extracts the `txhash` query param from a URL, preserving its original
 * encoding (hex or base64). The API accepts either format directly, so no
 * format normalization happens here — callers that specifically need base64
 * (e.g. comparing against an RPC node) should apply makeSafeBase64Hash themselves.
 */
export function parseTxHash(url: string) {
  if (!url.includes("txhash=")) {
    return "";
  }
  const params = url.split("txhash=");
  if (params.length < 2) return "";

  const txHash = params[1].split("&")[0];
  return decodeURIComponent(txHash).replaceAll(" ", "+");
}

function parsePositiveNumber(value: string): number {
  return value.startsWith("-") ? 0 : parseInt(value.replace(/[^0-9]/g, ""), 10);
}

function parseUnlockDepositValue(attrs: { key: string; value: string }[]): number {
  const unlockDepositAttr = attrs.find(attr => attr.key === "Deposit");
  return unlockDepositAttr ? parsePositiveNumber(unlockDepositAttr.value) : 0;
}

export function extractStorageDepositFromTxEvents(txEvents: GnoEvent[]): StorageDeposit | null {
  const storageEvent = txEvents.find(txEvent => txEvent.type === "StorageDeposit");
  const unlockStorageEvent = txEvents.find(txEvent => txEvent.type === "UnlockDeposit");

  if (!storageEvent || !storageEvent.attrs) {
    return null;
  }

  const depositAttr = storageEvent.attrs.find(attr => attr.key === "Deposit");
  const storageAttr = storageEvent.attrs.find(attr => attr.key === "Storage");

  if (!depositAttr || !storageAttr || !unlockStorageEvent) {
    return null;
  }

  const releaseStorageAttr = unlockStorageEvent.attrs.find(attr => attr.key === "ReleaseStorage");

  const baseDepositValue = parsePositiveNumber(depositAttr.value);
  const unlockValue =
    unlockStorageEvent && unlockStorageEvent.attrs ? parseUnlockDepositValue(unlockStorageEvent.attrs) : 0;
  const finalDepositValue = Math.max(0, baseDepositValue - unlockValue);

  const baseStorageValue = parsePositiveNumber(storageAttr.value);
  const releaseStorageValue = releaseStorageAttr ? parsePositiveNumber(releaseStorageAttr.value) : 0;
  const finalStorageValue = Math.max(0, baseStorageValue - releaseStorageValue);

  return {
    deposit: finalDepositValue,
    storage: finalStorageValue,
  };
}
