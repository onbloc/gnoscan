/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { decodeTxMessages, MsgAddPackage, MsgCall, MsgSend } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";
import { Tx, base64ToUint8Array } from "@gnolang/tm2-js-client";
import { parseTokenAmount } from "./token.utility";
import { StorageDeposit } from "@/models/storage-deposit-model";
import { GnoEvent } from "@/types";
import { GNOTToken } from "../hooks/common/use-token-meta";

export function decodeTransaction(tx: string) {
  const txBytes = base64ToUint8Array(tx);
  const hash = makeHash(txBytes);
  const decodedTx = Tx.decode(txBytes);
  const messages = decodeTxMessages(decodedTx.messages);
  return {
    ...decodedTx,
    hash,
    messages,
  };
}

export function makeSafeBase64Hash(data: string) {
  try {
    return Buffer.from(data, "base64").toString("base64");
  } catch {
    return data;
  }
}

export function isHash(hash: string): boolean {
  try {
    if (hash.length < 40) {
      return false;
    }

    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64regex.test(hash + "=") || base64regex.test(hash);
  } catch {
    return false;
  }
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

export function parseTxHash(url: string) {
  if (!url.includes("txhash=")) {
    return "";
  }
  const params = url.split("txhash=");
  if (params.length < 2) return "";

  const txHash = params[1].split("&")[0];
  const decodedTxHash = decodeURIComponent(txHash).replaceAll(" ", "+");
  return makeSafeBase64Hash(decodedTxHash);
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
