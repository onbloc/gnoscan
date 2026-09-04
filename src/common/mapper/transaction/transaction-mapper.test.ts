import { TransactionMapper } from "./transaction-mapper";
import { decodeTransaction } from "@/common/utils/transaction.utility";

jest.mock("@/common/utils/transaction.utility", () => ({
  decodeTransaction: jest.fn(),
}));

const mockedDecodeTransaction = decodeTransaction as jest.MockedFunction<typeof decodeTransaction>;

describe("TransactionMapper", () => {
  describe("transactionFromPendingRawTx", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("maps a successfully decoded raw tx into a pending transaction summary", () => {
      mockedDecodeTransaction.mockReturnValue({
        hash: "abc123",
        fee: { gas_wanted: "100000", gas_fee: "1000ugnot" },
        memo: "hello",
        messages: [{ "@type": "/vm.m_call" }],
      } as unknown as ReturnType<typeof decodeTransaction>);

      const result = TransactionMapper.transactionFromPendingRawTx("valid-base64-raw-tx");

      expect(result).not.toBeNull();
      expect(result?.transactionItem?.isPending).toBe(true);
      expect(result?.transactionItem?.success).toBe(false);
      expect(result?.transactionItem?.hash).toBe("abc123");
      expect(result?.transactionItem?.memo).toBe("hello");
      expect(result?.transactionItem?.gasWanted).toBe(100000);
      expect(result?.transactionItem?.fee).toEqual({ value: "1000", denom: "ugnot" });
      expect(result?.transactionItem?.numOfMessage).toBe(1);
    });

    it("returns null instead of throwing when the raw tx bytes fail to decode", () => {
      mockedDecodeTransaction.mockImplementation(() => {
        throw new Error("invalid protobuf");
      });

      expect(() => TransactionMapper.transactionFromPendingRawTx("not-valid-base64")).not.toThrow();
      expect(TransactionMapper.transactionFromPendingRawTx("not-valid-base64")).toBeNull();
    });
  });
});
