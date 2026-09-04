import { TransactionMapper } from "./transaction-mapper";
import { decodeTransaction } from "@/common/utils/transaction.utility";

jest.mock("@/common/utils/transaction.utility", () => ({
  decodeTransaction: jest.fn(),
  // Real implementation reimplemented here (rather than jest.requireActual) since the
  // real module transitively pulls in @gnolang/gno-js-client -> tm2-js-client, whose
  // uuid dependency ships ESM that jest's default transform can't parse.
  base64HashToHex: (base64: string) => Buffer.from(base64, "base64").toString("hex"),
}));

const mockedDecodeTransaction = decodeTransaction as jest.MockedFunction<typeof decodeTransaction>;

describe("TransactionMapper", () => {
  describe("transactionFromPendingRawTx", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("maps a successfully decoded raw tx into a pending transaction summary", () => {
      const hashBase64 = "n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=";
      const hashHex = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

      mockedDecodeTransaction.mockReturnValue({
        hash: hashBase64,
        fee: { gas_wanted: "100000", gas_fee: "1000ugnot" },
        memo: "hello",
        messages: [{ "@type": "/vm.m_call" }],
      } as unknown as ReturnType<typeof decodeTransaction>);

      const result = TransactionMapper.transactionFromPendingRawTx("valid-base64-raw-tx");

      expect(result).not.toBeNull();
      expect(result?.transactionItem?.isPending).toBe(true);
      expect(result?.transactionItem?.success).toBe(false);
      expect(result?.transactionItem?.hash).toBe(hashHex);
      expect(result?.transactionItem?.hashBase64).toBe(hashBase64);
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
