import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { SummaryCount } from "./ListSummary";
import { RealmsSummary } from "./RealmsSummary";

const mockSummary = { data: undefined as unknown, isFetched: true, isError: false };
const mockNewest = { data: { items: [], lastUpdated: "" } as unknown, isFetched: true, isError: false };
jest.mock("@/common/react-query/statistics", () => ({
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
  expect(renderText(<SummaryCount total={1234} new24h={12} unit="realms" isFetched />)).toBe("1,234 realms +12 (24h)");
});

it("hides a zero 24h change so a quiet day does not read as a dead chain", () => {
  expect(renderText(<SummaryCount total={32} new24h={0} unit="tokens" isFetched />)).toBe("32 tokens");
});

it("renders nothing while the total is loading", () => {
  expect(renderText(<SummaryCount unit="tokens" isFetched={false} />)).toBe("");
});

it("shows a dash when the total could not be loaded", () => {
  expect(renderText(<SummaryCount unit="tokens" isFetched />)).toBe("- tokens");
});

it("keeps every card with empty values when the summary request fails", () => {
  mockSummary.isError = true;
  const text = renderText(<RealmsSummary />);
  expect(text).toContain("Trending Realm");
  expect(text).toContain("24h Calls - Realm calls in the last 24h");
  expect(text).toContain("Active Callers (24h) - Unique callers in the last 24h");
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
