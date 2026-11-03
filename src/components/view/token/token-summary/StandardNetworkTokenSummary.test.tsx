/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";
import StandardNetworkTokenSummary from "./StandardNetworkTokenSummary";

let mockIsRegYn: "Y" | "N" = "N";
let mockPriced = true;
let mockLiveEntry: { price: string; changeRateOneDay?: number | null } | null = null;

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
        isRegYn: mockIsRegYn,
        price: mockPriced ? "100" : null,
        changeRateOneDay: mockPriced ? 1.5 : null,
      },
    },
  }),
  useGetTokenTransfersById: () => ({ data: undefined }),
}));
jest.mock("@/common/hooks/common/use-token-resource-meta", () => ({
  useTokenResourceMeta: () => ({
    getTokenMeta: (_: string, meta: object) => meta,
    getTokenDescription: () => undefined,
  }),
}));
jest.mock("@/common/hooks/common/use-token-price", () => ({
  useTokenPrice: () => ({ getPriceEntry: () => mockLiveEntry }),
}));
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));
jest.mock("@/components/ui/detail-field", () => ({
  Field: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FieldWithTooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AddressLink: () => null,
  DescriptionField: () => null,
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
  mockIsRegYn = "N";
  mockPriced = true;
  mockLiveEntry = null;
});

it("computes market cap from the exact supply and price, truncated to whole dollars", () => {
  const markup = renderSummary();
  // Market cap is the first value in the "Market Cap | Price" field.
  expect(markup).toContain("<span>$99 <");
  expect(markup).toContain("$100");
  expect(markup).toContain("0.999999999999999999");
});

it("shows a dash for a token without a gnoswap price", () => {
  mockPriced = false;
  const markup = renderSummary();
  expect(markup).not.toContain("<span>$");
  expect(markup).not.toContain("$100");
});

it("prefers the polled /prices entry over the price returned with the token", () => {
  mockLiveEntry = { price: "200", changeRateOneDay: 2 };
  const markup = renderSummary();
  expect(markup).toContain("<span>$199 <");
  expect(markup).toContain("$200");
  expect(markup).not.toContain("$100");
});

it("uses the polled /prices entry for a token the token API did not price", () => {
  mockPriced = false;
  mockLiveEntry = { price: "100" };
  expect(renderSummary()).toContain("<span>$99 <");
});

it("links the grc20reg registry when the token is registered", () => {
  mockIsRegYn = "Y";
  expect(renderSummary()).toContain("gno.land/r/nt/grc20reg/v0");
});

it("shows a dash for a token that was never registered", () => {
  expect(renderSummary()).not.toContain("grc20reg");
});
