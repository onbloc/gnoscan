/** @jest-environment jsdom */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { ActivityListResponse, ActivityRow } from "@/models/api/activity/activity-model";
import { AccountCsvExport, AccountCsvKind } from "./AccountCsvExport";

const mockRepository = {
  getAccountDirectTransactions: jest.fn(),
  getAccountNativeTransfers: jest.fn(),
  getAccountTokenTransfers: jest.fn(),
};
jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiAccountRepository: mockRepository }),
}));
jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "accountCsvTheme", default: "light" }) };
});
jest.mock("@/common/hooks/common/use-token-meta", () => ({
  GNOTToken: { symbol: "GNOT", denom: "ugnot", decimals: 6 },
}));
jest.mock("@/assets/svgs/icon-close.svg", () => () => null);
jest.mock("@/assets/svgs/icon-download.svg", () => () => null);

const row = (index: number): ActivityRow => ({
  txHash: `tx-${index}`,
  blockHeight: index,
  timestamp: "2026-11-01T23:59:59Z",
  successYn: true,
  messageCount: 1,
  func: [],
  fee: { value: "1", denom: "ugnot" },
  callerAddress: "caller",
  nativeValue: { value: "0", denom: "ugnot", symbol: "GNOT", decimals: 6 },
  amountsIn: [],
  amountsOut: [],
  volume: [],
  transferCount: 0,
  transfers: [],
  messages: [],
  realmEvents: [],
});
const page = (items: ActivityRow[], totalCount = items.length, hasNext = false): ActivityListResponse => ({
  items,
  page: { totalCount, hasNext },
});
let root: Root;
let host: HTMLDivElement;
let modal: HTMLDivElement;
let downloaded: { filename: string; blob: Blob }[];
let lastBlob: Blob;
const button = (name: string) => document.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
const apply = () => document.querySelector<HTMLButtonElement>("[role=dialog] button[aria-busy]")!;
const setDate = (index: number, value: string) => {
  const input = document.querySelectorAll<HTMLInputElement>("input[type=date]")[index];
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
};
const render = (kind: AccountCsvKind = "transactions", key = "account-a") =>
  act(() =>
    root.render(
      <RecoilRoot>
        <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
          <AccountCsvExport key={key} address="g1account" kind={kind} filter={{}} />
        </ThemeProvider>
      </RecoilRoot>,
    ),
  );
const pickRange = async () => {
  act(() => button("Download CSV").click());
  act(() => {
    setDate(0, "2026-11-01");
    setDate(1, "2026-11-01");
  });
  await act(async () => apply().click());
};
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
};

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  jest.useFakeTimers().setSystemTime(Date.UTC(2026, 10, 10));
  jest.clearAllMocks();
  downloaded = [];
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: jest.fn((blob: Blob) => {
      lastBlob = blob;
      return "blob:csv";
    }),
  });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: jest.fn() });
  jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
    downloaded.push({ filename: this.download, blob: lastBlob });
  });
  host = document.createElement("div");
  modal = document.createElement("div");
  modal.id = "modal-root";
  document.body.append(host, modal);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  modal.remove();
  jest.restoreAllMocks();
  jest.useRealTimers();
});

it("always opens the date dialog before export, including after a previous download", async () => {
  mockRepository.getAccountDirectTransactions.mockResolvedValueOnce(page([row(1)]));
  render();
  act(() => button("Download CSV").click());
  expect(apply().textContent).toBe("Download CSV");
  expect(mockRepository.getAccountDirectTransactions).not.toHaveBeenCalled();
  act(() => {
    setDate(0, "2026-11-01");
    setDate(1, "2026-11-01");
  });
  await act(async () => apply().click());
  expect(downloaded.map(item => item.filename)).toEqual(["account-g1account_transactions_2026-11-01_2026-11-01.csv"]);
  act(() => button("Close").click());
  act(() => button("Download CSV").click());
  expect(Array.from(document.querySelectorAll<HTMLInputElement>("input[type=date]")).map(input => input.value)).toEqual(
    ["2026-11-01", "2026-11-01"],
  );
  expect(mockRepository.getAccountDirectTransactions).toHaveBeenCalledTimes(1);
});

it("keeps over-limit feedback in the dialog so the dates can be narrowed and downloaded", async () => {
  mockRepository.getAccountDirectTransactions.mockResolvedValueOnce(page([row(1)], 3001, true));
  render();
  await pickRange();
  expect(document.querySelector("[role=dialog] [role=alert]")?.textContent).toMatch(/3,000.*smaller date range/);
  expect(downloaded).toEqual([]);

  mockRepository.getAccountDirectTransactions.mockResolvedValueOnce(page([row(1)]));
  act(() => {
    setDate(0, "2026-11-02");
    setDate(1, "2026-11-02");
  });
  await act(async () => apply().click());
  expect(downloaded.map(item => item.filename)).toEqual(["account-g1account_transactions_2026-11-02_2026-11-02.csv"]);
  expect(document.querySelector("[role=alert]")).toBeNull();
});

it.each<AccountCsvKind>(["transactions", "native-transfers", "token-transfers"])(
  "exports %s from the date dialog after its complete query succeeds",
  async kind => {
    const request =
      kind === "transactions"
        ? mockRepository.getAccountDirectTransactions
        : kind === "native-transfers"
        ? mockRepository.getAccountNativeTransfers
        : mockRepository.getAccountTokenTransfers;
    request.mockResolvedValueOnce(page([row(1)]));
    render(kind);
    await pickRange();
    expect(downloaded.map(item => item.filename)).toEqual([`account-g1account_${kind}_2026-11-01_2026-11-01.csv`]);
    expect(document.querySelector("[role=dialog] [role=status]")?.textContent).toMatch(/1 transactions/);
  },
);

it("prevents duplicate downloads and date edits while a request is pending", async () => {
  const result = deferred<ActivityListResponse>();
  mockRepository.getAccountDirectTransactions.mockReturnValueOnce(result.promise);
  render();
  await pickRange();
  expect(apply().disabled).toBe(true);
  expect(
    Array.from(document.querySelectorAll<HTMLInputElement>("input[type=date]")).every(input => input.disabled),
  ).toBe(true);
  act(() => apply().click());
  expect(mockRepository.getAccountDirectTransactions).toHaveBeenCalledTimes(1);
  await act(async () => result.resolve(page([row(1)])));
  expect(downloaded).toHaveLength(1);
  expect(apply().disabled).toBe(false);
});

it("cancels a closed dialog export without disrupting a new pending export", async () => {
  const old = deferred<ActivityListResponse>();
  const current = deferred<ActivityListResponse>();
  mockRepository.getAccountDirectTransactions.mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
  render();
  await pickRange();
  act(() => button("Close").click());
  await pickRange();
  await act(async () =>
    old.resolve(
      page(
        Array.from({ length: 100 }, (_, i) => row(i)),
        101,
        true,
      ),
    ),
  );
  expect(mockRepository.getAccountDirectTransactions).toHaveBeenCalledTimes(2);
  expect(downloaded).toEqual([]);
  expect(apply().disabled).toBe(true);
  await act(async () => current.resolve(page([row(1)])));
  expect(downloaded).toHaveLength(1);
});

it("abandons an old account/tab/filter export without requesting another page or downloading", async () => {
  const result = deferred<ActivityListResponse>();
  mockRepository.getAccountDirectTransactions.mockReturnValueOnce(result.promise);
  render();
  await pickRange();
  render("native-transfers", "account-b");
  await act(async () =>
    result.resolve(
      page(
        Array.from({ length: 100 }, (_, i) => row(i)),
        101,
        true,
      ),
    ),
  );
  expect(mockRepository.getAccountDirectTransactions).toHaveBeenCalledTimes(1);
  expect(downloaded).toEqual([]);
  expect(document.querySelector("[role=dialog]")).toBeNull();
});

it("shows empty results and request failures inside the dialog without downloading", async () => {
  mockRepository.getAccountDirectTransactions.mockResolvedValueOnce(page([]));
  render();
  await pickRange();
  expect(document.querySelector("[role=dialog] [role=status]")?.textContent).toMatch(/No transactions/);
  expect(downloaded).toEqual([]);
  mockRepository.getAccountDirectTransactions.mockRejectedValueOnce(new Error("network"));
  await act(async () => apply().click());
  expect(document.querySelector("[role=dialog] [role=alert]")).not.toBeNull();
  expect(downloaded).toEqual([]);
});
