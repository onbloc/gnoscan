import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { SummaryCount } from "./ListSummary";
import { RealmsSummary } from "./RealmsSummary";

const mockSummary = { data: undefined as unknown, isFetched: true, isError: false };
const mockNewest = { data: { items: [], lastUpdated: "" } as unknown, isFetched: true, isError: false };
jest.mock("@/common/react-query/statistics", () => ({
  LIST_SUMMARY_REFETCH_INTERVAL: 60_000,
  useGetSummaryRealms: () => mockSummary,
  useGetNewestRealms: () => mockNewest,
}));
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));

const renderText = (element: React.ReactElement) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      {element}
    </ThemeProvider>,
  )
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

beforeEach(() => {
  mockSummary.data = undefined;
  mockSummary.isError = false;
});

it("shows the 24h change next to the total", () => {
  expect(renderText(<SummaryCount total={1234} new24h={12} unit="realms" />)).toBe("1,234 realms +12 (24h)");
});

it("hides a zero 24h change so a quiet day does not read as a dead chain", () => {
  expect(renderText(<SummaryCount total={32} new24h={0} unit="tokens" />)).toBe("32 tokens");
});

it("renders nothing before the total is known", () => {
  expect(renderText(<SummaryCount unit="tokens" />)).toBe("");
});

it("hides the summary API cards when the summary request fails", () => {
  mockSummary.isError = true;
  const text = renderText(<RealmsSummary />);
  expect(text).toContain("Recently Deployed");
  expect(text).not.toContain("Trending Realm");
  expect(text).not.toContain("24h Calls");
});

it("keeps the cards when a later poll fails after data loaded", () => {
  mockSummary.isError = true;
  mockSummary.data = { data: { total: 1, new24h: 0, calls24h: 8901, activeCallers24h: 321, trending: [] } };
  const text = renderText(<RealmsSummary />);
  expect(text).toContain("24h Calls");
  expect(text).toContain("8,901");
});

it("shows an empty state instead of a blank trending card", () => {
  mockSummary.data = { data: { total: 1, new24h: 0, calls24h: 0, activeCallers24h: 0, trending: [] } };
  const text = renderText(<RealmsSummary />);
  expect(text).toContain("No realm calls in the last 24h");
  expect(text).toContain("No realms deployed yet");
});
