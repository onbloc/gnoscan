/* eslint-disable @typescript-eslint/no-explicit-any */
import { toNumber, toString } from "@/common/utils/string-util";
import { Transaction } from "@/types/data-type";
import { BankSendValue, MsgRunValue } from "../response/transaction.types";
import { getDefaultMessage } from "../utility";
import { AddPackageValue, MsgCallValue, RealmTransaction } from "./types";

export function isAddPackageMessageValue(messageValue: any): messageValue is AddPackageValue {
  return messageValue?.creator !== undefined && messageValue?.package !== undefined;
}

export function isMsgCallMessageValue(messageValue: any): messageValue is MsgCallValue {
  return messageValue?.caller !== undefined && messageValue?.pkg_path !== undefined;
}

export function isBankSendMessageValue(messageValue: any): messageValue is BankSendValue {
  return messageValue?.from_address !== undefined && messageValue?.to_address !== undefined;
}

export function isMsgRunMessageValue(messageValue: any): messageValue is MsgRunValue {
  return messageValue?.caller !== undefined && messageValue?.package !== undefined;
}

export function mapTransactionTypeNameByMessage(message: any): string {
  if (isMsgCallMessageValue(message)) {
    return "MsgCall";
  }

  if (isAddPackageMessageValue(message)) {
    return "AddPackage";
  }

  if (isMsgRunMessageValue(message)) {
    return "MsgRun";
  }

  return "BankMsgSend";
}

export function mapTransactionByRealm(tx: RealmTransaction): Transaction {
  const defaultMessage = getDefaultMessage(tx.messages);
  if (isAddPackageMessageValue(defaultMessage.value)) {
    return {
      hash: tx.hash,
      success: tx.success,
      numOfMessage: tx.messages.length,
      type: "/vm.m_addpkg",
      packagePath: toString(defaultMessage.value.package?.path),
      gasUsed: {
        value: `${tx.gas_used || 0}`,
        denom: "ugnot",
      },
      functionName: "AddPkg",
      blockHeight: toNumber(tx.block_height),
      from: toString(defaultMessage.value.creator),
      amount: {
        value: "0",
        denom: "ugnot",
      },
      time: "",
      fee: {
        value: toString(tx.gas_fee.amount),
        denom: "ugnot",
      },
      messages: tx.messages,
    };
  }

  if (tx.messages.length === 1 && defaultMessage.value.func === "Transfer") {
    return {
      hash: tx.hash,
      success: tx.success,
      numOfMessage: tx.messages.length,
      type: "/vm.m_call",
      packagePath: toString(defaultMessage.value.pkg_path),
      functionName: toString(defaultMessage.value.func),
      blockHeight: toNumber(tx.block_height),
      from: toString(defaultMessage.value.caller),
      to: defaultMessage.value.args?.[1] || "",
      amount: {
        value: toString(defaultMessage.value.args?.[1] || 0),
        denom: defaultMessage.value.pkg_path || "",
      },
      time: "",
      fee: {
        value: toString(tx.gas_fee.amount),
        denom: "ugnot",
      },
      messages: tx.messages,
    };
  }

  return {
    hash: tx.hash,
    success: tx.success,
    numOfMessage: tx.messages.length,
    type: "/vm.m_call",
    packagePath: toString(defaultMessage.value.pkg_path),
    functionName: toString(defaultMessage.value.func),
    blockHeight: toNumber(tx.block_height),
    from: toString(defaultMessage.value.caller),
    amount: {
      value: toString(defaultMessage.value.send),
      denom: "ugnot",
    },
    time: "",
    fee: {
      value: toString(tx.gas_fee.amount),
      denom: "ugnot",
    },
    messages: tx.messages,
  };
}
