/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import StandardNetworkTokenSummary from "./StandardNetworkTokenSummary";

// The token list pages for this package; tests set registeredPackagePath to model registered or unregistered tokens.
type MockRow = { tokenId: string; registeredPackagePath?: string };
let mockPackageTokenRow: MockRow = { tokenId: "gno.land/r/demo/foo.FOO" };
let mockPackageTokens: { pages: MockRow[][]; hasNextPage?: boolean; isError?: boolean } | null = null;
const mockFetchNextPage = jest.fn();

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
  useGetTokens: () => {
    const { pages, hasNextPage = false, isError = false } = mockPackageTokens ?? { pages: [[mockPackageTokenRow]] };
    return {
      data: { pages: pages.map(items => ({ items })) },
      hasNextPage,
      isFetchingNextPage: false,
      isError,
      fetchNextPage: mockFetchNextPage,
    };
  },
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

const renderSummary = () => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: anyValue, fonts: anyValue }}>
        <StandardNetworkTokenSummary tokenId="gno.land/r/demo/foo.FOO" />
      </ThemeProvider>,
    ),
  );
  const markup = container.innerHTML;
  act(() => root.unmount());
  return markup;
};

beforeEach(() => {
  mockFetchNextPage.mockClear();
  mockPackageTokens = null;
});

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

it("loads later pages to find a registration beyond the first page", () => {
  const otherRow = { tokenId: "gno.land/r/demo/foo.BAR" };
  mockPackageTokens = { pages: [[otherRow]], hasNextPage: true };
  expect(renderSummary()).not.toContain("grc20reg");
  expect(mockFetchNextPage).toHaveBeenCalledTimes(1);

  mockPackageTokens = {
    pages: [[otherRow], [{ tokenId: "gno.land/r/demo/foo.FOO", registeredPackagePath: "gno.land/r/demo/foo" }]],
  };
  expect(renderSummary()).toContain("gno.land/r/nt/grc20reg/v0");
});

it("does not load more pages once the token row is found", () => {
  mockPackageTokens = { pages: [[{ tokenId: "gno.land/r/demo/foo.FOO" }]], hasNextPage: true };
  renderSummary();
  expect(mockFetchNextPage).not.toHaveBeenCalled();
});

it("stops loading pages after a request fails", () => {
  mockPackageTokens = { pages: [[{ tokenId: "gno.land/r/demo/foo.BAR" }]], hasNextPage: true, isError: true };
  expect(renderSummary()).not.toContain("grc20reg");
  expect(mockFetchNextPage).not.toHaveBeenCalled();
});
