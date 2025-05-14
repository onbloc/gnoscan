import { getTransactionMessageType } from "./message.utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { API_MESSAGE_TYPES, TRANSACTION_FUNCTION_TYPES } from "../values/message-types.constant";

describe("getTransactionMessageType", () => {
  describe("Testing basic mappings", () => {
    test("BankMsgSend -> Transfer", () => {
      const message = { messageType: API_MESSAGE_TYPES.BANK_MSG_SEND } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(TRANSACTION_FUNCTION_TYPES.TRANSFER);
    });

    test("AddPackage -> AddPkg", () => {
      const message = { messageType: API_MESSAGE_TYPES.ADD_PACKAGE } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(TRANSACTION_FUNCTION_TYPES.ADD_PKG);
    });

    test("MsgRun -> MsgRun", () => {
      const message = { messageType: API_MESSAGE_TYPES.MSG_RUN } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(TRANSACTION_FUNCTION_TYPES.MSG_RUN);
    });
  });

  describe("Testing the MSG_CALL special case", () => {
    test("Must return funcType if present when MSG_CALL type is present", () => {
      const customFuncType = "CUSTOM_FUNCTION";
      const message = {
        messageType: API_MESSAGE_TYPES.MSG_CALL,
        funcType: customFuncType,
      } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(customFuncType);
    });

    test("Must return messageType if funcType is not present when MSG_CALL type is present", () => {
      const message = {
        messageType: API_MESSAGE_TYPES.MSG_CALL,
      } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(API_MESSAGE_TYPES.MSG_CALL);
    });
  });

  describe("Testing the funcType special case", () => {
    test("In MSG_CALL, messageType must be returned if funcType is an empty string", () => {
      const message = {
        messageType: API_MESSAGE_TYPES.MSG_CALL,
        funcType: "",
      } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(API_MESSAGE_TYPES.MSG_CALL);
    });

    test("In MSG_CALL, empty string must be returned if funcType is an empty string", () => {
      const message = {
        messageType: "",
        funcType: "",
      } as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe("");
    });

    test("If funcType is null in MSG_CALL, messageType must be returned", () => {
      const message = {
        messageType: API_MESSAGE_TYPES.MSG_CALL,
        funcType: null,
      } as unknown as TransactionContractModel;
      expect(getTransactionMessageType(message)).toBe(API_MESSAGE_TYPES.MSG_CALL);
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
