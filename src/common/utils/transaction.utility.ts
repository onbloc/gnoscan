/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { decodeTxMessages } from "@gnolang/gno-js-client";
import { Tx, base64ToUint8Array } from "@gnolang/tm2-js-client";
import { parseTokenAmount } from "./token.utility";
import { StorageDeposit } from "@/models/storage-deposit-model";
import { GnoEvent } from "@/types";

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
      if (message.func === "Transfer") {
        return {
          type: message["@type"],
          packagePath: message.pkg_path,
          functionName: message.func,
          from: message.caller,
          to: message.args.length > 0 ? message.args[0] : "",
          amount: {
            value: message.args.length > 1 ? message.args[1] : "0",
            denom: message.pkg_path,
          },
        };
      }
      const amountValue = parseTokenAmount(message.send);

      return {
        type: message["@type"],
        packagePath: message.pkg_path,
        functionName: message.func,
        from: message.caller,
        amount: {
          value: amountValue,
          denom: "ugnot",
        },
      };
    }
    case "/vm.m_addpkg": {
      const amountValue = parseTokenAmount(message.deposit);

      return {
        type: message["@type"],
        packagePath: message.package?.path || message.package?.Path || "",
        functionName: "AddPkg",
        from: message.creator,
        amount: {
          value: amountValue,
          denom: "ugnot",
        },
      };
    }
    case "/vm.m_run": {
      return {
        type: message["@type"],
        packagePath: message.package?.path || message.package?.Path || "",
        functionName: "MsgRun",
        from: message.caller,
        amount: {
          value: "0",
          denom: "ugnot",
        },
      };
    }
    case "/bank.MsgSend": {
      const amountValue = parseTokenAmount(message.amount);

      return {
        type: message["@type"],
        packagePath: "/bank.MsgSend",
        functionName: "Transfer",
        from: message.from_address,
        to: message.to_address,
        amount: {
          value: amountValue,
          denom: "ugnot",
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

export function extractStorageDepositFromTxEvents(txEvents: GnoEvent[]): StorageDeposit | null {
  const storageEvent = txEvents.find(txEvent => txEvent.type === "StorageDeposit");

  if (!storageEvent || !storageEvent.attrs) {
    return null;
  }

  const depositAttr = storageEvent.attrs.find(attr => attr.key === "Deposit");
  const storageAttr = storageEvent.attrs.find(attr => attr.key === "Storage");

  if (!depositAttr || !storageAttr) {
    return null;
  }

  return {
    deposit: parsePositiveNumber(depositAttr.value),
    storage: parsePositiveNumber(storageAttr.value),
  };
}
