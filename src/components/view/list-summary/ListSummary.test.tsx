import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { SummaryBars, toCountBadge, toPctBadge } from "./ListSummary";
import { RealmsSummary } from "./RealmsSummary";
import { TokensSummary } from "./TokensSummary";
import { MOCK_SUMMARY_TOKENS } from "@/repositories/api/statistics/response/list-summary-mock";

const mockSummary = { data: undefined as unknown, isFetched: true, isError: false };
jest.mock("@/common/react-query/statistics", () => ({
  useGetSummaryRealms: () => mockSummary,
  useGetSummaryTokens: () => mockSummary,
}));
jest.mock("@/assets/svgs/icon-unknown-token.svg", () => () => null);
const mockUseMappedApiTokens = jest.fn((..._args: unknown[]) => ({ data: [], isFetched: true, isError: false }));
jest.mock("@/common/services/token/use-mapped-api-tokens", () => ({
  useMappedApiTokens: (...args: unknown[]) => mockUseMappedApiTokens(...args),
}));
jest.mock("@/common/hooks/common/use-token-resource-meta", () => ({
  useTokenResourceMeta: () => ({
    getTokenMeta: (_: string, fallback: { name: string; symbol: string; image?: string }) => fallback,
  }),
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
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

beforeEach(() => {
  mockSummary.data = undefined;
  mockSummary.isError = false;
});

describe("toPctBadge", () => {
  it("rounds to one decimal and drops a trailing zero", () => {
    expect(toPctBadge(18.04, " vs yesterday")).toEqual({ label: "+18% vs yesterday", tone: "up" });
    expect(toPctBadge(-8.25)).toEqual({ label: "-8.3%", tone: "down" });
  });

  it("shows new when the previous window was empty and hides no change", () => {
    expect(toPctBadge(null)).toEqual({ label: "new", tone: "up" });
    expect(toPctBadge(0)).toBeUndefined();
    expect(toPctBadge(0.04)).toBeUndefined();
    expect(toPctBadge(-0.03)).toBeUndefined();
    expect(toPctBadge(undefined)).toBeUndefined();
  });
});

it("hides a zero count change", () => {
  expect(toCountBadge(37, " this week")).toEqual({ label: "+37 this week", tone: "up" });
  expect(toCountBadge(0, " this week")).toBeUndefined();
});

it("keeps every card with empty values when the summary request fails", () => {
  mockSummary.isError = true;
  const text = renderText(<RealmsSummary />);
  expect(text).toContain("Builders · 7d - Deploys · - publishers this week");
  expect(text).toContain("Calls · 24h -");
  expect(text).toContain("Storage · 24h - GNOT locked - GNOT released");
});

it("renders the realm summary from the API", () => {
  mockSummary.data = {
    data: {
      builders: [
        {
          address: "g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr",
          namespace: "gno.land/r/g1le",
          deploys7d: 3,
          deploysPrev7d: 0,
        },
      ],
      publishers7d: 14,
      mostCalled: [
        { path: "gno.land/r/gnoswap/router", calls24h: 1204, deltaPct: 12, uniqueCallers24h: 212 },
        { path: "gno.land/r/demo/solo", calls24h: 5, deltaPct: 0, uniqueCallers24h: 1 },
      ],
      calls: { calls24h: 3982, deltaPct: 9, daily: [], uniqueCallers24h: 212, realmsTouched24h: 38 },
      storage: { locked24h: 412.3, released24h: 38.1, bytesDelta24h: 0, largestRealm: null },
    },
  };
  const text = renderText(<RealmsSummary />);
  expect(text).toContain("g1leu8d2...tztu95wr");
  expect(text).toContain("3 new");
  expect(text).toContain("r/gnoswap/router 212 callers 1,204 +12%");
  expect(text).toContain("r/demo/solo 1 caller 5");
  expect(text).toContain("3,982 +9% vs yesterday");
  expect(text).toContain("Daily · last 7 days · 212 callers · 38 realms");
  expect(text).toContain("Net +374.2 GNOT");
});

it("lists newly created tokens whether or not they are registered", () => {
  mockSummary.data = MOCK_SUMMARY_TOKENS;
  const fresh = {
    tokenId: "gno.land/r/demo/fresh.FRSH.0000000",
    packagePath: "gno.land/r/demo/fresh",
    name: "Fresh",
    symbol: "FRSH",
    logoUrl: "",
    registered: false,
    createdAt: null,
  };
  mockUseMappedApiTokens.mockImplementationOnce(() => ({ data: [fresh] as never[], isFetched: true, isError: false }));
  const text = renderText(<TokensSummary />);
  expect(text).toContain("Fresh FRSH");
  expect(text).toContain("7 added this week");
});

it("renders the token cards from the summary alone", () => {
  mockSummary.data = MOCK_SUMMARY_TOKENS;
  const text = renderText(<TokensSummary />);
  expect(text).toContain("Gnoswap GNS 126 +24%");
  expect(text).toContain("356 +18% vs yesterday");
  expect(text).toContain("Daily · last 7 days · 12 tokens · 92 senders");
  expect(text).toContain("Most held Gnoswap · 587");
});

it("does not keep another network's recent tokens while the new network loads", () => {
  renderText(<TokensSummary />);
  expect(mockUseMappedApiTokens).toHaveBeenCalledWith(
    expect.objectContaining({ sort: "id" }),
    expect.objectContaining({ keepPreviousData: false }),
  );
});

it("shows the token cards empty when the summary request fails", () => {
  mockSummary.isError = true;
  const text = renderText(<TokensSummary />);
  expect(text).toContain("Transfers · 24h -");
  expect(text).toContain("Most held -");
});

it("shows a tiny net storage loss as +0.0 rather than -0.0", () => {
  mockSummary.data = {
    data: {
      builders: [],
      publishers7d: 0,
      mostCalled: [],
      calls: { calls24h: 0, deltaPct: 0, daily: [], uniqueCallers24h: 0, realmsTouched24h: 0 },
      storage: { locked24h: 1, released24h: 1.04, bytesDelta24h: 0, largestRealm: null },
    },
  };
  expect(renderText(<RealmsSummary />)).toContain("Net +0.0 GNOT");
});

it("labels each bar with its date and value, naming stacked series", () => {
  const markup = renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <SummaryBars
        label="Daily NFT activity"
        dates={["2026-10-21", "2026-10-22"]}
        series={[
          { color: "blue", name: "transfer", values: [1, 1263] },
          { color: "orange", name: "mint", values: [1, 48] },
        ]}
      />
    </ThemeProvider>,
  );
  expect(markup).toContain("2026-10-22 1,263 transfers · 48 mints");
  expect(markup).toContain("2026-10-21 1 transfer · 1 mint");
});
