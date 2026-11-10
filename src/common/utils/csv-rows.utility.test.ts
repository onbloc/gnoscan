import { BlockModel } from "@/models/api/block/block-model";
import { TransactionModel } from "@/models/api/transaction/transaction-model";
import { BLOCK_CSV_HEADER, TRANSACTION_CSV_HEADER, toBlockCsvRow, toTransactionCsvRow } from "./csv-rows.utility";

jest.mock("@/common/hooks/common/use-token-meta", () => ({
  GNOTToken: { symbol: "GNOT", denom: "ugnot", decimals: 6 },
}));

const block: BlockModel = {
  blockHash: "hash1",
  blockHeight: 12,
  transactionCount: 3,
  blockProposer: "g1proposer",
  blockProposerLabel: "val-1",
  network: "dev",
  timestamp: "2026-11-06T12:00:00+09:00",
  totalFees: 1_500_000,
};

const tx: TransactionModel = {
  txHash: "tx1",
  blockHeight: 12,
  timestamp: "2026-11-06T12:00:00Z",
  successYn: true,
  messageCount: 1,
  fromAddress: "g1from",
  fromName: "",
  toAddress: "g1to",
  toName: "",
  fee: { value: "1000000", denom: "ugnot" },
  amount: { value: "2500000", denom: "ugnot" },
  func: [{ messageType: "/bank.MsgSend", funcType: "Send", pkgPath: "" }],
};

describe("toBlockCsvRow", () => {
  it("matches the header and writes the time in UTC and the fees in GNOT", () => {
    const row = toBlockCsvRow(block);

    expect(row).toHaveLength(BLOCK_CSV_HEADER.length);
    expect(row).toEqual(["hash1", 12, "2026-11-06T03:00:00.000Z", 3, "g1proposer", "val-1", "1.5"]);
  });

  it("writes zero fees", () => {
    expect(toBlockCsvRow({ ...block, totalFees: 0 })[6]).toBe("0");
  });
});

describe("toTransactionCsvRow", () => {
  it("matches the header and converts ugnot amounts to GNOT", () => {
    const row = toTransactionCsvRow(tx);

    expect(row).toHaveLength(TRANSACTION_CSV_HEADER.length);
    expect(row.slice(0, 2)).toEqual(["tx1", "Success"]);
    expect(row.slice(3, 12)).toEqual([1, 12, "2026-11-06T12:00:00.000Z", "g1from", "g1to", "2.5", "GNOT", "1", "GNOT"]);
  });

  it("keeps another denom as it is, and leaves a missing amount empty", () => {
    const row = toTransactionCsvRow({
      ...tx,
      successYn: false,
      amount: { value: "7", denom: "gno.land/r/demo/foo.FOO" },
    });
    expect(row[1]).toBe("Failed");
    expect(row.slice(8, 10)).toEqual(["7", "gno.land/r/demo/foo.FOO"]);

    const noAmount = toTransactionCsvRow({ ...tx, amount: undefined as unknown as TransactionModel["amount"] });
    expect(noAmount.slice(8, 10)).toEqual(["", ""]);
  });

  it("leaves the function empty without one", () => {
    expect(toTransactionCsvRow({ ...tx, func: [] })[2]).toBe("");
  });
});
