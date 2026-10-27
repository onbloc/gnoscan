import { EMPTY_TRANSACTION_FILTER, toTransactionFilterParams } from "./use-transaction-filter";

describe("toTransactionFilterParams", () => {
  it("sends no parameters for an empty filter", () => {
    expect(toTransactionFilterParams(EMPTY_TRANSACTION_FILTER)).toEqual({});
  });

  it("keeps filled fields and trims the function name", () => {
    expect(
      toTransactionFilterParams({
        fromDate: "2026-10-01",
        toDate: "2026-10-02",
        status: "failed",
        messageType: "exec",
        function: "  Transfer ",
      }),
    ).toEqual({
      fromDate: "2026-10-01",
      toDate: "2026-10-02",
      status: "failed",
      messageType: "exec",
      function: "Transfer",
    });
  });

  it("omits a blank function name", () => {
    expect(toTransactionFilterParams({ ...EMPTY_TRANSACTION_FILTER, function: "   " })).toEqual({});
  });

  it("swaps a reversed date range", () => {
    expect(
      toTransactionFilterParams({ ...EMPTY_TRANSACTION_FILTER, fromDate: "2026-10-05", toDate: "2026-10-01" }),
    ).toEqual({ fromDate: "2026-10-01", toDate: "2026-10-05" });
  });

  it("keeps a single date bound", () => {
    expect(toTransactionFilterParams({ ...EMPTY_TRANSACTION_FILTER, toDate: "2026-10-01" })).toEqual({
      toDate: "2026-10-01",
    });
  });

  it("resolves a function name typed in another case to its candidate", () => {
    const names = ["Heartbeat", "Transfer", "TransferFrom"];
    const params = (typed: string) =>
      toTransactionFilterParams({ ...EMPTY_TRANSACTION_FILTER, function: typed }, names).function;

    expect(params("heartbeat")).toBe("Heartbeat");
    expect(params("TRANSFERFROM")).toBe("TransferFrom");
    expect(params("Transfer")).toBe("Transfer");
    expect(params("Unknown")).toBe("Unknown");
  });

  it("keeps the typed name when several candidates differ only by case", () => {
    expect(
      toTransactionFilterParams({ ...EMPTY_TRANSACTION_FILTER, function: "mint" }, ["Mint", "MINT"]).function,
    ).toBe("mint");
  });
});
