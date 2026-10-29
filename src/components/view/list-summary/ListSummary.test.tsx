import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import dayjs from "dayjs";
import { SummaryBars, toCountBadge, toPctBadge } from "./ListSummary";
import { NftsSummary } from "./NftsSummary";
import { RealmsSummary } from "./RealmsSummary";
import { TokensSummary } from "./TokensSummary";
import { GetSummaryTokensResponse } from "@/repositories/api/statistics/response/get-list-summary-response";

const mockSummary = { data: undefined as unknown, isFetched: true, isError: false };
jest.mock("@/common/react-query/statistics", () => ({
  useGetSummaryNftCollections: () => mockSummary,
  useGetSummaryRealms: () => mockSummary,
  useGetSummaryTokens: () => mockSummary,
}));
jest.mock("@/common/hooks/nft/use-nft-collection-name", () => ({
  useNftCollectionName: () => (_path: string | undefined, name: string) => name,
}));
jest.mock("@/common/hooks/nft/use-nft-artwork", () => ({
  useNftArtwork: () => () => ({ src: "", isLoading: false }),
}));
jest.mock("@/components/view/datatable/item/nft-collection-title", () => ({ NftCollectionLogo: () => null }));
jest.mock("@/components/view/nft/nft-image/NftImage", () => () => null);
jest.mock("@/assets/svgs/icon-unknown-token.svg", () => () => null);
jest.mock("@/components/ui/tooltip", () => ({
  EllipsisTooltip: ({ children }: { children: React.ReactNode }) => children,
}));
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

const GNS = { tokenId: "gno.land/r/gnoswap/gns.GNS.0000000", packagePath: "gno.land/r/gnoswap/gns", logoUrl: null };
const SUMMARY_TOKENS: GetSummaryTokensResponse = {
  data: {
    weeklyNewCount: 7,
    mostActive: [{ ...GNS, name: "Gnoswap", symbol: "GNS", transfers24h: 126, deltaPct: 24 }],
    transfers: { count24h: 356, activeTokens24h: 12, deltaPct: 18, daily: [], uniqueSenders24h: 92 },
    holders: {
      holdersTotal: 1204,
      mostHeld: { ...GNS, name: "Gnoswap", symbol: "GNS", holders: 587 },
      fastestGrowing: {
        tokenId: "gno.land/r/demo/bubble.BUBBLE.0000000",
        packagePath: "gno.land/r/demo/bubble",
        name: "Bubble",
        symbol: "BUBBLE",
        logoUrl: null,
        holdersDelta7d: 22,
      },
    },
  },
};

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
  expect(text).toContain("Builders · 7d - Deploys · - publishers in 7 days");
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
  expect(text).toContain("3,982 +9% vs previous 24h");
  expect(text).toContain("Last 7 days · 212 callers · 38 realms");
  expect(text).toContain("Net +374.2 GNOT");
});

it("lists newly created tokens whether or not they are registered", () => {
  mockSummary.data = SUMMARY_TOKENS;
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
  expect(text).toContain("7 added in 7 days");
});

// The age opens the transaction the token was created in, while the rest of the row still opens the token.
it("links a newly added token's age to its creation transaction", () => {
  mockSummary.data = SUMMARY_TOKENS;
  const token = (symbol: string, createdTransactionHash: string | null) => ({
    tokenId: `gno.land/r/demo/${symbol}.${symbol}.0000000`,
    packagePath: `gno.land/r/demo/${symbol}`,
    name: symbol,
    symbol,
    logoUrl: "",
    registered: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdTransactionHash,
  });
  mockUseMappedApiTokens.mockImplementationOnce(() => ({
    data: [token("NEW", "geQ1/t8pCJ0gFOueMfw5ZznodFVkZqwkcFoJBVMUlYM="), token("OLD", null)] as never[],
    isFetched: true,
    isError: false,
  }));
  const markup = renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <TokensSummary />
    </ThemeProvider>,
  );
  expect(markup).toMatch(/href="\/tokens\/gno\.land\/r\/demo\/NEW\.NEW"/);
  expect(markup).toMatch(/href="\/transactions\/details\?txhash=geQ1\/t8pCJ0gFOueMfw5ZznodFVkZqwkcFoJBVMUlYM="/);
  expect(markup).toMatch(/href="\/tokens\/gno\.land\/r\/demo\/OLD\.OLD"/);
  expect(markup.match(/txhash=/g)).toHaveLength(1);
  expect(markup).not.toMatch(/<a[^>]*>(?:(?!<\/a>).)*<a /s);
});

it("renders the token cards from the summary alone", () => {
  mockSummary.data = SUMMARY_TOKENS;
  const text = renderText(<TokensSummary />);
  expect(text).toContain("Gnoswap GNS 126 +24%");
  expect(text).toContain("356 +18% vs previous 24h");
  expect(text).toContain("Last 7 days · 12 tokens · 92 senders");
  expect(text).toContain("Most held Gnoswap · 587");
  expect(text).toContain("Fastest growing BUBBLE · +22");
});

it("lists the newest created tokens without keeping another network's while the new network loads", () => {
  renderText(<TokensSummary />);
  expect(mockUseMappedApiTokens).toHaveBeenCalledWith(
    expect.objectContaining({ sort: "createdAt", order: "desc" }),
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

// The card's 24h figures are the last bar, so Just Minted counts the same mints as Activity.
it("counts Just Minted over the same 24h as the activity bars", () => {
  mockSummary.data = {
    data: {
      justMinted: [],
      rising: [],
      activity: { events24h: 1489, deltaPct: 19.9, transfers24h: 1472, mints24h: 17, daily: [] },
      collectors: { holdersTotal: 0, topCollector: null, avgPerWallet: 0, userHeld: 0, realmHeld: 0 },
    },
  };
  const text = renderText(<NftsSummary />);
  expect(text).toContain("17 minted in 24h");
  expect(text).toContain("1,489 +19.9% vs previous 24h");
  expect(text).toContain("Last 7 days 1,472 transfers 17 mints");
});

// Each minted NFT reads as its collection symbol and number, falling back to the collection name.
it("labels a just minted NFT with its symbol and number", () => {
  mockSummary.data = {
    data: {
      justMinted: [
        {
          tokenId: "gno.land/r/gnoswap/gnft.GNFT.0000000",
          packagePath: "gno.land/r/gnoswap/gnft",
          collectionName: "GnoSwap NFT",
          nftId: "1314",
          mintedAt: new Date().toISOString(),
        },
        {
          tokenId: "gno.land/r/demo/odd.ODD.000000a",
          packagePath: "gno.land/r/demo/other",
          collectionName: "Odd",
          nftId: "7",
          mintedAt: new Date().toISOString(),
        },
      ],
      rising: [],
      activity: { events24h: 0, deltaPct: 0, transfers24h: 0, mints24h: 2, daily: [] },
      collectors: { holdersTotal: 0, topCollector: null, avgPerWallet: 0, userHeld: 0, realmHeld: 0 },
    },
  };
  const text = renderText(<NftsSummary />);
  expect(text).toContain("GNFT #1314");
  expect(text).toContain("Odd #7");
  expect(text).not.toContain("GnoSwap NFT #1314 ");
});

it("labels each bar with its local 24h period and value, naming stacked series", () => {
  const periods = [
    { start: "2026-10-25T10:58:14Z", end: "2026-10-26T10:58:14Z" },
    { start: "2026-10-26T10:58:14Z", end: "2026-10-27T10:58:14Z" },
  ];
  const local = (time: string) => dayjs(time).format("MM/DD HH:mm");
  const markup = renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <SummaryBars
        label="NFT activity per 24h"
        periods={periods}
        series={[
          { color: "blue", name: "transfer", values: [1, 1263] },
          { color: "orange", name: "mint", values: [1, 48] },
        ]}
      />
    </ThemeProvider>,
  );
  expect(markup).toContain(`${local(periods[1].start)} ~ ${local(periods[1].end)} 1,263 transfers · 48 mints`);
  expect(markup).toContain(`${local(periods[0].start)} ~ ${local(periods[0].end)} 1 transfer · 1 mint`);
});
