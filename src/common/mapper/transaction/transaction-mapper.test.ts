import { TransactionMapper } from "./transaction-mapper";
import { BlockInfo, Tx } from "@gnolang/tm2-js-client";
import { BlockResults } from "@/common/clients/node-client";
import { makeHash, decodeTransaction } from "@/common/utils/transaction.utility";
import { GNOLAND1_TX, GNOLAND1_TX_PUB_KEY } from "@/common/utils/__fixtures__/gnoland1-tx";

jest.mock("@gnolang/tm2-js-client", () => ({
  Tx: jest.requireActual("../../../../node_modules/@gnolang/tm2-js-client/dist/proto/tm2/tx.cjs").Tx,
  base64ToUint8Array: (value: string) => Uint8Array.from(Buffer.from(value, "base64")),
  uint8ArrayToBase64: (value: Uint8Array) => Buffer.from(value).toString("base64"),
}));
jest.mock("@gnolang/gno-js-client", () =>
  jest.requireActual("../../../../node_modules/@gnolang/gno-js-client/dist/wallet/utility/utility.cjs"),
);
jest.mock("@/common/hooks/common/use-token-meta", () => ({ GNOTToken: { denom: "ugnot" } }));
jest.mock("@/common/utils/transaction.utility", () => {
  const actual = jest.requireActual("@/common/utils/transaction.utility");
  return { ...actual, decodeTransaction: jest.fn(actual.decodeTransaction) };
});

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

describe("transactionFromRpcBlock", () => {
  beforeEach(() => {
    // transactionFromPendingRawTx tests reset this mock, so the real decoder is restored here.
    mockedDecodeTransaction.mockImplementation(
      jest.requireActual("@/common/utils/transaction.utility").decodeTransaction,
    );
  });

  const hash = makeHash(Buffer.from(GNOLAND1_TX, "base64"));
  const block = {
    block_meta: { header: { time: "2026-01-01T00:00:00Z" } },
    block: {
      header: { chain_id: "gnoland1", height: "123", time: "2026-01-01T00:00:00Z" },
      data: { txs: ["/w==", GNOLAND1_TX] },
    },
  } as unknown as BlockInfo;
  const blockResult = {
    deliver_tx: [
      { ResponseBase: { Error: { message: "other tx failed" } }, GasWanted: "10", GasUsed: "10" },
      { ResponseBase: { Error: null, Events: null }, GasWanted: "7000000", GasUsed: "3500000" },
    ],
  } as unknown as BlockResults;
  const getTokenAmount = (denom: string, value: string | number) => ({ denom, value: String(value) });

  it("returns the existing defaults when no block is available", () => {
    expect(TransactionMapper.transactionFromRpcBlock(null, null, hash, getTokenAmount)).toEqual({
      network: "-",
      timeStamp: { time: "-", passedTime: "" },
      txResult: null,
      gas: "0/0 (0%)",
      transactionItem: null,
      transactionEvents: [],
    });
  });

  it("maps the real transaction and its result at the same block index", () => {
    const decode = jest.spyOn(Tx, "decode");
    const result = TransactionMapper.transactionFromRpcBlock(block, blockResult, hash, getTokenAmount);
    expect(decode).toHaveBeenCalledTimes(1);
    decode.mockRestore();
    expect(result.network).toBe("gnoland1");
    expect(result.txResult).toBe(blockResult.deliver_tx[1]);
    expect(result.gas).toBe("3,500,000/7,000,000 (50.00%)");
    expect(result.transactionItem).toMatchObject({
      hash,
      success: true,
      blockHeight: 123,
      fee: { denom: "ugnot", value: "7000" },
    });
    expect(JSON.parse(result.transactionItem!.rawContent!).signatures[0].pub_key).toEqual(GNOLAND1_TX_PUB_KEY);
  });

  it("returns no transaction when the hash is absent from the block", () => {
    const result = TransactionMapper.transactionFromRpcBlock(block, blockResult, "missing", getTokenAmount);
    expect(result.transactionItem).toBeNull();
    expect(result.txResult).toBeNull();
    expect(result.gas).toBe("0/0 (0%)");
  });

  it("keeps block metadata but no transaction when block results are unavailable", () => {
    const result = TransactionMapper.transactionFromRpcBlock(block, null, hash, getTokenAmount);
    expect(result.network).toBe("gnoland1");
    expect(result.transactionItem).toBeNull();
    expect(result.gas).toBe("0/0 (0%)");
  });

  it("does not match a transaction whose bytes cannot be decoded", () => {
    const result = TransactionMapper.transactionFromRpcBlock(
      block,
      blockResult,
      makeHash(Buffer.from([255])),
      getTokenAmount,
    );
    expect(result.transactionItem).toBeNull();
    expect(result.txResult).toBeNull();
  });
});
