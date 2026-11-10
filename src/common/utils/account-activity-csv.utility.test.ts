import { ActivityListResponse, ActivityRow } from "@/models/api/activity/activity-model";
import {
  ACCOUNT_CSV_LIMIT,
  AccountCsvLimitError,
  AccountCsvAmountFormatters,
  fetchAccountActivityCsv,
} from "./account-activity-csv.utility";
import { resolveTokenMeta, TokenResourceEntry } from "./token.utility";
import { toGNOTAmount } from "./native-token-utility";

const formatters: AccountCsvAmountFormatters = {
  getTokenMeta: (denom, fallback) => resolveTokenMeta({}, denom, fallback),
  getFeeAmount: fee => toGNOTAmount(fee.value, fee.denom),
};

jest.mock("@/common/hooks/common/use-token-meta", () => ({
  GNOTToken: { symbol: "GNOT", denom: "ugnot", decimals: 6 },
}));

const activity = (index: number, overrides: Partial<ActivityRow> = {}): ActivityRow => ({
  txHash: `tx-${index}`,
  blockHeight: index,
  timestamp: "2026-11-06T12:00:00+09:00",
  successYn: true,
  messageCount: 1,
  func: [{ messageType: "/bank.MsgSend", funcType: "Send", pkgPath: "" }],
  fee: { value: "1000000", denom: "ugnot" },
  callerAddress: "g1caller",
  nativeValue: { value: "2500000", denom: "ugnot", decimals: 6, symbol: "GNOT" },
  amountsIn: [],
  amountsOut: [],
  volume: [],
  transferCount: 0,
  transfers: [],
  messages: [],
  realmEvents: [],
  ...overrides,
});

const pageResponse = (items: ActivityRow[], totalCount: number, hasNext = false): ActivityListResponse => ({
  items,
  page: { totalCount, hasNext },
});

const paginatedFetcher = (total: number) =>
  jest.fn(async ({ page, limit }: { page: number; limit: number }): Promise<ActivityListResponse> => {
    const offset = (page - 1) * limit;
    const length = Math.min(limit, total - offset);
    return pageResponse(
      Array.from({ length }, (_, index) => activity(offset + index)),
      total,
      offset + length < total,
    );
  });

describe("fetchAccountActivityCsv pagination", () => {
  it("rejects more than 3000 before requesting another page", async () => {
    const fetchPage = jest.fn().mockResolvedValue(pageResponse([], ACCOUNT_CSV_LIMIT + 1, true));

    await expect(fetchAccountActivityCsv(fetchPage, "direct", formatters)).rejects.toBeInstanceOf(AccountCsvLimitError);
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(fetchPage).toHaveBeenCalledWith({ page: 1, limit: 100 });
  });

  it("allows exactly 3000 through the last page without a 31st request", async () => {
    const fetchPage = paginatedFetcher(ACCOUNT_CSV_LIMIT);
    const { rows } = await fetchAccountActivityCsv(fetchPage, "direct", formatters);

    expect(rows).toHaveLength(ACCOUNT_CSV_LIMIT);
    expect(rows[0][0]).toBe("tx-0");
    expect(rows[ACCOUNT_CSV_LIMIT - 1][0]).toBe("tx-2999");
    expect(fetchPage).toHaveBeenCalledTimes(30);
    expect(fetchPage).toHaveBeenLastCalledWith({ page: 30, limit: 100 });
  });

  it.each([0, 1, 100, 101, 251, 2999])("retrieves every row for total %i", async total => {
    const fetchPage = paginatedFetcher(total);
    const { header, rows } = await fetchAccountActivityCsv(fetchPage, "transfers", formatters);

    expect(rows.map(row => row[0])).toEqual(Array.from({ length: total }, (_, index) => `tx-${index}`));
    expect(rows.every(row => row.length === header.length)).toBe(true);
    expect(fetchPage).toHaveBeenCalledTimes(Math.max(1, Math.ceil(total / 100)));
    fetchPage.mock.calls.forEach(([pagination], index) => {
      expect(pagination).toEqual({ page: index + 1, limit: 100 });
    });
  });

  it("propagates a second-page error instead of returning partial rows", async () => {
    const error = new Error("network unavailable");
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce(
        pageResponse(
          Array.from({ length: 100 }, (_, index) => activity(index)),
          101,
          true,
        ),
      )
      .mockRejectedValueOnce(error);

    await expect(fetchAccountActivityCsv(fetchPage, "direct", formatters)).rejects.toBe(error);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("blocks a later page reporting more than 3000 without requesting a third page", async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce(
        pageResponse(
          Array.from({ length: 100 }, (_, index) => activity(index)),
          200,
          true,
        ),
      )
      .mockResolvedValueOnce(pageResponse([], ACCOUNT_CSV_LIMIT + 1, true));

    await expect(fetchAccountActivityCsv(fetchPage, "direct", formatters)).rejects.toBeInstanceOf(AccountCsvLimitError);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it.each([-1, 1.5, NaN, Infinity])("rejects invalid totalCount %s", async totalCount => {
    const fetchPage = jest.fn().mockResolvedValue(pageResponse([], totalCount));

    await expect(fetchAccountActivityCsv(fetchPage, "direct", formatters)).rejects.toThrow("pagination");
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["empty nonempty result", pageResponse([], 1)],
    [
      "short first page",
      pageResponse(
        Array.from({ length: 99 }, (_, index) => activity(index)),
        101,
        true,
      ),
    ],
    [
      "oversized page",
      pageResponse(
        Array.from({ length: 101 }, (_, index) => activity(index)),
        101,
      ),
    ],
    [
      "early last page",
      pageResponse(
        Array.from({ length: 100 }, (_, index) => activity(index)),
        101,
      ),
    ],
    ["extra next page", pageResponse([activity(0)], 1, true)],
    ["rows with zero count", pageResponse([activity(0)], 0)],
    ["missing page", { items: [] }],
    ["missing hasNext", { items: [], page: { totalCount: 0 } }],
    ["missing totalCount", { items: [], page: { hasNext: false } }],
    ["missing items", { page: { totalCount: 0, hasNext: false } }],
  ])("rejects %s", async (_, response) => {
    const fetchPage = jest.fn().mockResolvedValue(response);

    await expect(fetchAccountActivityCsv(fetchPage, "direct", formatters)).rejects.toThrow("pagination");
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["changed total", pageResponse([activity(100)], 100)],
    ["truncated final page", pageResponse([], 101)],
    ["oversized final page", pageResponse([activity(100), activity(101)], 101)],
    ["next page after total", pageResponse([activity(100)], 101, true)],
  ])("rejects %s on a later page", async (_, response) => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce(
        pageResponse(
          Array.from({ length: 100 }, (_, index) => activity(index)),
          101,
          true,
        ),
      )
      .mockResolvedValueOnce(response);

    await expect(fetchAccountActivityCsv(fetchPage, "direct", formatters)).rejects.toThrow("pagination");
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("rejects overlapping pages rather than silently deduplicating", async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce(
        pageResponse(
          Array.from({ length: 100 }, (_, index) => activity(index)),
          101,
          true,
        ),
      )
      .mockResolvedValueOnce(pageResponse([activity(0)], 101));

    await expect(fetchAccountActivityCsv(fetchPage, "direct", formatters)).rejects.toThrow("Repeated");
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it("keeps the same hash included at distinct heights across pages", async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce(
        pageResponse(
          Array.from({ length: 100 }, (_, index) => activity(index)),
          101,
          true,
        ),
      )
      .mockResolvedValueOnce(pageResponse([activity(100, { txHash: "tx-0" })], 101));

    const { rows } = await fetchAccountActivityCsv(fetchPage, "direct", formatters);
    expect(rows).toHaveLength(101);
    expect(rows[0].slice(0, 5)).toEqual(["tx-0", "Success", "Transfer", 1, 0]);
    expect(rows[100].slice(0, 5)).toEqual(["tx-0", "Success", "Transfer", 1, 100]);
  });
});

describe("fetchAccountActivityCsv mapping", () => {
  it("reuses transaction function selection, UTC, caller and exact native/fee conversion", async () => {
    const item = activity(7, {
      successYn: false,
      messageCount: 2,
      func: [
        { messageType: "/vm.m_call", funcType: "Approve", pkgPath: "gno.land/r/demo/token" },
        { messageType: "/vm.m_call", funcType: "Swap", pkgPath: "gno.land/r/demo/swap" },
      ],
      nativeValue: { value: "900719925474099312345678", denom: "ugnot", decimals: 6, symbol: "GNOT" },
      fee: { value: "900719925474099312345679", denom: "ugnot" },
    });
    const { header, rows } = await fetchAccountActivityCsv(async () => pageResponse([item], 1), "direct", formatters);

    expect(header).toEqual([
      "Tx Hash",
      "Status",
      "Function",
      "Messages",
      "Block",
      "Time (UTC)",
      "Caller",
      "Native Value",
      "Native Value Denom",
      "Fee",
      "Fee Denom",
    ]);
    expect(rows).toEqual([
      [
        "tx-7",
        "Failed",
        "Swap",
        2,
        7,
        "2026-11-06T03:00:00.000Z",
        "g1caller",
        "900719925474099312.345678",
        "GNOT",
        "900719925474099312.345679",
        "GNOT",
      ],
    ]);
    expect(rows[0]).toHaveLength(header.length);
  });

  it("matches visible precision while retaining raw amounts, asset identities and repeated NFT IDs", async () => {
    const item = activity(1, {
      amountsIn: [
        {
          value: "900719925474099312345678901234567890",
          decimals: 18,
          symbol: "SAME",
          denom: "gno.land/r/demo/token-a.SAME.0000000",
        },
        { value: "1", decimals: 24, symbol: "SAME", denom: "gno.land/r/demo/token-b.SAME.0000000" },
        {
          value: "3",
          decimals: 0,
          symbol: "NFT",
          denom: "gno.land/r/demo/nft.NFT.0000000",
          tokenIds: ["9007199254740993", "2", "2"],
        },
      ],
      amountsOut: [{ value: "0", decimals: 6, symbol: "GNOT", denom: "ugnot" }],
    });
    const { header, rows } = await fetchAccountActivityCsv(
      async () => pageResponse([item], 1),
      "transfers",
      formatters,
    );

    expect(header).toEqual([
      "Tx Hash",
      "Status",
      "Function",
      "Messages",
      "Block",
      "Time (UTC)",
      "Amount (In)",
      "Amount (Out)",
      "Fee",
      "Fee Denom",
    ]);
    expect(rows[0].slice(0, 6)).toEqual(["tx-1", "Success", "Transfer", 1, 1, "2026-11-06T03:00:00.000Z"]);
    expect(JSON.parse(rows[0][6] as string)).toEqual([
      {
        value: "900719925474099312.345678",
        rawValue: "900719925474099312345678901234567890",
        decimals: 18,
        symbol: "SAME",
        denom: "gno.land/r/demo/token-a.SAME.0000000",
      },
      {
        value: "0",
        rawValue: "1",
        decimals: 24,
        symbol: "SAME",
        denom: "gno.land/r/demo/token-b.SAME.0000000",
      },
      {
        value: "3",
        rawValue: "3",
        decimals: 0,
        symbol: "NFT",
        denom: "gno.land/r/demo/nft.NFT.0000000",
        tokenIds: ["9007199254740993", "2", "2"],
      },
    ]);
    expect(JSON.parse(rows[0][7] as string)).toEqual([]);
    expect(rows[0].slice(8)).toEqual(["1", "GNOT"]);
    expect(rows[0]).toHaveLength(header.length);
  });

  it("writes empty transfers and an empty function without inventing activity", async () => {
    const item = activity(0, { func: [], fee: { value: "7", denom: "other" } });
    const { rows } = await fetchAccountActivityCsv(async () => pageResponse([item], 1), "transfers", formatters);

    expect(rows[0][2]).toBe("");
    expect(rows[0].slice(6)).toEqual(["[]", "[]", "7", "other"]);
  });

  it.each([
    "gno.land/r/gnoland/wugnot",
    "gno.land/r/gnoland/wugnot.wugnot",
    "gno.land/r/gnoland/wugnot.wugnot.0000000",
  ])("uses the screen wugnot correction for %s while keeping the original integer", async denom => {
    const item = activity(1, { amountsIn: [{ value: "5000000", denom, decimals: 0, symbol: "wugnot" }] });
    const { rows } = await fetchAccountActivityCsv(async () => pageResponse([item], 1), "transfers", formatters);
    expect(JSON.parse(rows[0][6] as string)).toEqual([
      {
        value: "5",
        rawValue: "5000000",
        decimals: 6,
        symbol: "wugnot",
        denom,
      },
    ]);
  });

  it("prefers per-token resource metadata over conflicting backend values", async () => {
    const a = "gno.land/r/demo/factory.A.0000001";
    const b = "gno.land/r/demo/factory.B.0000002";
    const resources: Record<string, TokenResourceEntry> = {
      "gno.land/r/demo/factory.A": { name: "A", symbol: "RESOURCE-A", decimals: 6 },
      "gno.land/r/demo/factory.B": { name: "B", symbol: "RESOURCE-B", decimals: 9 },
    };
    const item = activity(1, {
      amountsIn: [a, b].map(denom => ({ value: "5000000", denom, decimals: 0, symbol: "BACKEND" })),
    });
    const { rows } = await fetchAccountActivityCsv(async () => pageResponse([item], 1), "transfers", {
      ...formatters,
      getTokenMeta: (denom, fallback) => resolveTokenMeta(resources, denom, fallback),
    });
    expect(JSON.parse(rows[0][6] as string)).toEqual([
      { value: "5", rawValue: "5000000", decimals: 6, symbol: "RESOURCE-A", denom: a },
      { value: "0.005", rawValue: "5000000", decimals: 9, symbol: "RESOURCE-B", denom: b },
    ]);
  });

  it("exports the displayed direct native value even for multi-message transactions, and a dash for zero", async () => {
    const items = [
      activity(0, { messageCount: 2 }),
      activity(1, {
        nativeValue: { value: "0", denom: "ugnot", decimals: 6, symbol: "GNOT" },
      }),
    ];
    const { rows } = await fetchAccountActivityCsv(async () => pageResponse(items, 2), "direct", formatters);
    expect(rows.map(row => row.slice(7, 9))).toEqual([
      ["2.5", "GNOT"],
      ["-", ""],
    ]);
  });
});
