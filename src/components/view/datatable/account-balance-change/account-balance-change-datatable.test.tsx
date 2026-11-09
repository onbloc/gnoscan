/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import { AccountNativeBalanceChange } from "@/repositories/api/account/response";
import { AccountBalanceChangeDatatable } from "./account-balance-change-datatable";

// The table is a plain one that renders each header on each row, so the columns are what is under test.
jest.mock("@/components/ui/datatable", () => ({
  __esModule: true,
  default: ({
    headers,
    datas,
  }: {
    headers: { name: string; key: string; renderOption: (value: unknown, row: unknown) => React.ReactNode }[];
    datas: Record<string, unknown>[];
  }) => (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {datas.map(row => (
          <tr key={row.txHash as string}>
            {headers.map((header, index) => (
              <td key={index}>{header.renderOption(row[header.key], row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  DatatableOption: jest.requireActual("@/components/ui/datatable/option"),
}));
jest.mock("@/common/hooks/common/use-token-meta", () => ({
  GNOTToken: { denom: "ugnot", symbol: "GNOT", decimals: 6 },
  useTokenMeta: () => ({
    getTokenAmount: (_denom: string, ugnot: string) => ({ value: `${Number(ugnot) / 1e6}`, denom: "GNOT" }),
  }),
}));
jest.mock("..", () => ({
  DatatableItem: {
    TxHash: ({ txHash, status }: { txHash: string; status: string }) => <span>{`${txHash}:${status}`}</span>,
    Type: ({ functionName, messageCount }: { functionName: string; messageCount: number }) => (
      <span>{`${functionName || "-"}/${messageCount}`}</span>
    ),
    Block: ({ height }: { height: number }) => <span>{`#${height}`}</span>,
    Amount: ({ value, denom }: { value: string; denom: string }) => <span>{`${value} ${denom}`}</span>,
    Date: ({ date }: { date: string }) => <span>{date}</span>,
  },
}));
jest.mock("../activity", () => ({ TOOLTIP_TYPE: "tooltip" }));

const change = (overrides: Partial<AccountNativeBalanceChange>): AccountNativeBalanceChange => ({
  txHash: "tx",
  blockHeight: 10,
  timestamp: "2026-10-25T10:00:00Z",
  successYn: true,
  amount: "0",
  changes: [],
  messageCount: 1,
  func: [{ messageType: "/vm.m_call", funcType: "Do", pkgPath: "gno.land/r/test/x" }],
  ...overrides,
});

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));

beforeEach(() => {
  container = document.createElement("div");
  root = createRoot(container);
});

afterEach(() => act(() => root.unmount()));

const rowsOf = (data: AccountNativeBalanceChange[]) => {
  act(() => root.render(<AccountBalanceChangeDatatable data={data} isFetched />));
  return Array.from(container.querySelectorAll("tbody tr")).map(row =>
    Array.from(row.querySelectorAll("td")).map(cell => cell.textContent),
  );
};

describe("AccountBalanceChangeDatatable", () => {
  it("has the columns of the Native Transfers tab, without the fee", () => {
    rowsOf([change({})]);

    expect(Array.from(container.querySelectorAll("th")).map(cell => cell.textContent)).toEqual([
      "Tx Hash",
      "Function",
      "Block",
      "Amount (In)",
      "Amount (Out)",
      "Time",
    ]);
  });

  it("puts a gain under In and a loss under Out, in GNOT and without its sign, and a dash for the other side", () => {
    const rows = rowsOf([change({ txHash: "gain", amount: "1500000" }), change({ txHash: "loss", amount: "-62241" })]);

    expect(rows[0].slice(3, 5)).toEqual(["1.5 GNOT", "-"]);
    expect(rows[1].slice(3, 5)).toEqual(["-", "0.062241 GNOT"]);
  });

  it("marks a failed transaction as failed", () => {
    const rows = rowsOf([change({ txHash: "ok" }), change({ txHash: "bad", successYn: false })]);

    expect(rows[0][0]).toBe("ok:success");
    expect(rows[1][0]).toBe("bad:failure");
  });

  it("shows the function of a transaction with several messages, with the number of its messages", () => {
    const rows = rowsOf([
      change({
        messageCount: 3,
        func: [
          { messageType: "/vm.m_call", funcType: "Approve", pkgPath: "gno.land/r/test/token" },
          { messageType: "/vm.m_call", funcType: "Swap", pkgPath: "gno.land/r/test/pool" },
          { messageType: "/vm.m_call", funcType: "Approve", pkgPath: "gno.land/r/test/token" },
        ],
      }),
    ]);

    // The approval only prepares the swap, so the swap names the transaction.
    expect(rows[0][1]).toBe("Swap/3");
  });

  it("leaves the function empty instead of failing for a row without messages", () => {
    const rows = rowsOf([
      change({ txHash: "empty", messageCount: 0, func: [] }),
      change({ txHash: "missing", messageCount: undefined, func: undefined } as unknown as AccountNativeBalanceChange),
    ]);

    expect(rows.map(row => row[1])).toEqual(["-/0", "-/0"]);
  });
});
