import { getTransactionMessageType } from "./message.utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES, TRANSACTION_FUNCTION_TYPES } from "../values/message-types.constant";

describe("getTransactionMessageType", () => {
  describe("Testing basic mappings", () => {
    test("BankMsgSend -> Transfer", () => {
      const message = { messageType: MESSAGE_TYPES.BANK_MSG_SEND } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(TRANSACTION_FUNCTION_TYPES.TRANSFER);
    });

    test("AddPackage -> AddPkg", () => {
      const message = { messageType: MESSAGE_TYPES.VM_ADDPKG } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(TRANSACTION_FUNCTION_TYPES.ADD_PKG);
    });

    test("MsgRun -> MsgRun", () => {
      const message = { messageType: MESSAGE_TYPES.VM_RUN } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(TRANSACTION_FUNCTION_TYPES.MSG_RUN);
    });
  });

  describe("Testing the VM_CALL special case", () => {
    test("Must return funcType if present when VM_CALL type is present", () => {
      const customFuncType = "CUSTOM_FUNCTION";
      const message = {
        messageType: MESSAGE_TYPES.VM_CALL,
        funcType: customFuncType,
      } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(customFuncType);
    });

    test("Must return messageType if funcType is not present when VM_CALL type is present", () => {
      const message = {
        messageType: MESSAGE_TYPES.VM_CALL,
      } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(MESSAGE_TYPES.VM_CALL);
    });
  });

  describe("Testing the funcType special case", () => {
    test("In VM_CALL, messageType must be returned if funcType is an empty string", () => {
      const message = {
        messageType: MESSAGE_TYPES.VM_CALL,
        funcType: "",
      } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(MESSAGE_TYPES.VM_CALL);
    });

    test("In VM_CALL, empty string must be returned if funcType is an empty string", () => {
      const message = {
        messageType: "",
        funcType: "",
      } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe("");
    });

    test("If funcType is null in VM_CALL, messageType must be returned", () => {
      const message = {
        messageType: MESSAGE_TYPES.VM_CALL,
        funcType: null,
      } as unknown as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(MESSAGE_TYPES.VM_CALL);
    });
  });

  describe("Testing edge cases", () => {
    test("Unknown message types should be returned as is", () => {
      const unknownType = "UNKNOWN_MESSAGE_TYPE";
      const message = { messageType: unknownType } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(unknownType);
    });

    test("Empty string message types should return an empty string", () => {
      const message = { messageType: "" } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe("");
    });

    test("If messageType is undefined, should return undefined", () => {
      const message = {} as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(undefined);
    });

    test("Must return null if messageType is null", () => {
      const message = { messageType: null } as unknown as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(null);
    });
  });
});
