import { BlockModel } from "@/models/api/block/block-model";
import { TransactionModel } from "@/models/api/transaction/transaction-model";
import {
  BLOCK_CSV_HEADER,
  TRANSACTION_CSV_HEADER,
  toBlockCsvRow,
  toCsvAmountValue,
  toTransactionCsvRow,
} from "./csv-rows.utility";

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

describe("toCsvAmountValue", () => {
  it.each([
    ["9007199254740993123456789.123456789", "9007199254740993123456789.123456"],
    ["9,007,199,254,740,993.1234569", "9007199254740993.123456"],
    ["0.000000123", "0.000000"],
    ["1e-8", "0.000000"],
    ["1.9999999", "1.999999"],
    ["5.0", "5"],
    ["5.00", "5.00"],
    ["5", "5"],
  ])("formats %s as the visible ungrouped amount %s", (value, expected) => {
    expect(toCsvAmountValue(value)).toBe(expected);
  });
});

describe("toBlockCsvRow", () => {
  it("matches the header and writes the time in UTC and the fees in GNOT", () => {
    const row = toBlockCsvRow(block);

    expect(row).toHaveLength(BLOCK_CSV_HEADER.length);
    expect(row).toEqual(["hash1", 12, "2026-11-06T03:00:00.000Z", 3, "g1proposer", "val-1", "1.5"]);
  });

  it("writes zero fees", () => {
    expect(toBlockCsvRow({ ...block, totalFees: 0 })[6]).toBe("0");
  });

  it("preserves large fee integers exactly and truncates fractional GNOT", () => {
    expect(toBlockCsvRow({ ...block, totalFees: "9007199254740993123456789" as unknown as number })[6]).toBe(
      "9007199254740993123.456789",
    );
    expect(toBlockCsvRow({ ...block, totalFees: 1.9 })[6]).toBe("0.000001");
  });
});

describe("toTransactionCsvRow", () => {
  it("matches the header and uses resolved GNOT amounts and native fees", () => {
    const row = toTransactionCsvRow(tx, { value: "2.5", denom: "GNOT" });

    expect(row).toHaveLength(TRANSACTION_CSV_HEADER.length);
    expect(row.slice(0, 2)).toEqual(["tx1", "Success"]);
    expect(row.slice(3, 12)).toEqual([1, 12, "2026-11-06T12:00:00.000Z", "g1from", "g1to", "2.5", "GNOT", "1", "GNOT"]);
  });

  it("exports metadata-resolved wugnot rather than its raw integer", () => {
    const row = toTransactionCsvRow(
      {
        ...tx,
        successYn: false,
        amount: { value: "5000000", denom: "gno.land/r/demo/wugnot.WUGNOT" },
      },
      { value: "5", denom: "wugnot" },
    );

    expect(row[1]).toBe("Failed");
    expect(row.slice(8, 10)).toEqual(["5", "wugnot"]);
  });

  it("truncates resolved token quantities without rounding or losing integer precision", () => {
    expect(toTransactionCsvRow(tx, { value: "900719925474099312.3456789", denom: "TOKEN" }).slice(8, 10)).toEqual([
      "900719925474099312.345678",
      "TOKEN",
    ]);
    expect(toTransactionCsvRow(tx, { value: "0.000000123", denom: "TOKEN" }).slice(8, 10)).toEqual([
      "0.000000",
      "TOKEN",
    ]);
  });

  it("matches the zero amount dash and multi-message More label", () => {
    const zero = { ...tx, amount: { value: "0", denom: "ugnot" } };
    expect(toTransactionCsvRow(zero, { value: "0", denom: "GNOT" }).slice(8, 10)).toEqual(["-", ""]);
    expect(toTransactionCsvRow({ ...zero, messageCount: 2 }, { value: "0", denom: "GNOT" }).slice(8, 10)).toEqual([
      "More",
      "",
    ]);
    expect(toTransactionCsvRow({ ...tx, messageCount: 2 }, null).slice(8, 10)).toEqual(["More", ""]);
  });

  it("leaves an unresolved amount empty", () => {
    expect(toTransactionCsvRow(tx, null).slice(8, 10)).toEqual(["", ""]);
  });

  it("converts native fees exactly and truncates beyond the visible precision", () => {
    expect(
      toTransactionCsvRow({ ...tx, fee: { value: "9007199254740993123456789", denom: "ugnot" } }, null).slice(10),
    ).toEqual(["9007199254740993123.456789", "GNOT"]);
    expect(toTransactionCsvRow({ ...tx, fee: { value: "0.1", denom: "ugnot" } }, null).slice(10)).toEqual([
      "0.000000",
      "GNOT",
    ]);
  });

  it("leaves the function empty without one", () => {
    expect(toTransactionCsvRow({ ...tx, func: [] }, null)[2]).toBe("");
  });
});
