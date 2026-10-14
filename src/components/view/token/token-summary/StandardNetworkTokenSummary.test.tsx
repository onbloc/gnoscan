import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import StandardNetworkTokenSummary from "./StandardNetworkTokenSummary";

// The token list row for this package; tests set registeredPackagePath to model registered or unregistered tokens.
let mockPackageTokenRow: { tokenId: string; registeredPackagePath?: string } = { tokenId: "gno.land/r/demo/foo.FOO" };

jest.mock("@/common/react-query/token/api", () => ({
  useGetTokenById: () => ({
    isFetched: true,
    data: {
      data: {
        tokenId: "gno.land/r/demo/foo.FOO",
        path: "gno.land/r/demo/foo",
        name: "Foo",
        symbol: "FOO",
        decimals: 18,
        totalSupply: "999999999999999999",
        holders: 1,
        funcTypesList: [],
      },
    },
  }),
  useGetTokenTransfersById: () => ({ data: undefined }),
  useGetTokens: () => ({ data: { pages: [{ items: [mockPackageTokenRow] }] } }),
}));
jest.mock("@/common/hooks/common/use-token-resource-meta", () => ({
  useTokenResourceMeta: () => ({ getTokenMeta: (_: string, meta: object) => meta }),
}));
jest.mock("@/common/hooks/common/use-token-price", () => ({
  useTokenPrice: () => ({ getPriceEntry: () => ({ price: "100", change24h: 0 }) }),
}));
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));
jest.mock("@/components/ui/detail-field", () => ({
  Field: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FieldWithTooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AddressLink: () => null,
}));
jest.mock(
  "@/components/view/details-data-section",
  () =>
    function MockDataSection({ children }: { children: React.ReactNode }) {
      return <>{children}</>;
    },
);
jest.mock(
  "@/components/ui/badge",
  () =>
    function MockBadge({ children }: { children: React.ReactNode }) {
      return <>{children}</>;
    },
);
jest.mock("@/components/ui/text/price-change-text", () => ({ PriceChangeText: () => null }));
jest.mock("@/components/ui/show-log", () => () => null);
jest.mock("../../common/table-skeleton/TableSkeleton", () => () => null);
jest.mock("@/components/ui/public-functions", () => () => null);
jest.mock("@/components/ui/tooltip/copy-tooltip", () => ({ CopyTooltip: () => null }));

// Stub theme: every color and font token resolves to a harmless value.
const anyValue = new Proxy({}, { get: () => "inherit" });

const renderSummary = () =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: anyValue, fonts: anyValue }}>
      <StandardNetworkTokenSummary tokenId="gno.land/r/demo/foo.FOO" />
    </ThemeProvider>,
  );

it("computes market cap from the exact supply, not a rounded number", () => {
  const markup = renderSummary();
  // Market cap is the first value in the "Market Cap | Price" field; the exact cap $99.99... truncates to $99.
  expect(markup).toContain("<span>$99 <");
  expect(markup).toContain("0.999999999999999999");
});

it("links the grc20reg registry when the token list reports a registration", () => {
  mockPackageTokenRow = { tokenId: "gno.land/r/demo/foo.FOO", registeredPackagePath: "gno.land/r/demo/foo" };
  expect(renderSummary()).toContain("gno.land/r/nt/grc20reg/v0");
});

it("shows a dash for a token that was never registered", () => {
  mockPackageTokenRow = { tokenId: "gno.land/r/demo/foo.FOO" };
  expect(renderSummary()).not.toContain("grc20reg");
});
