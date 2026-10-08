import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import theme from "@/styles/theme";
import AccountAssetItem from "./AccountAssetItem";

jest.mock("@/assets/svgs/icon-unknown-token.svg", () => "svg");
jest.mock("@/assets/svgs/icon-link.svg", () => "svg");

const mockPrices = { data: undefined as unknown };

// Mirrors useTokenMeta: ugnot is shifted by 6 decimals, symbols of already-shifted GRC20 amounts pass through.
jest.mock("@/common/hooks/common/use-token-meta", () => ({
  useTokenMeta: () => ({
    getTokenImage: () => undefined,
    getTokenAmount: (denom: string, value: string) =>
      denom === "ugnot" ? { denom: "GNOT", value: String(Number(value) / 1e6) } : { denom, value },
    getTokenInfo: (denom: string) => ({ name: denom }),
  }),
}));

jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));

jest.mock("@/common/react-query/price", () => ({
  useGetPrices: () => mockPrices,
}));

const baseProps = {
  breakpoint: DEVICE_TYPE.DESKTOP,
  isDesktop: true,
  isFetched: true,
};

const render = (element: React.ReactElement) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      {element}
    </ThemeProvider>,
  ).replace(/<[^>]*>/g, "");

beforeEach(() => {
  mockPrices.data = {
    items: [
      { assetId: "gno.land/r/gnoland/wugnot.wugnot", provider: "gnoswap", price: "0.024", status: "fresh" },
      { assetId: "gno.land/r/gnoswap/gns.GNS", provider: "gnoswap", price: "0.5", status: "fresh" },
    ],
  };
});

describe("AccountAssetItem", () => {
  it("prices a native balance given in base units by its display amount", () => {
    const markup = render(<AccountAssetItem {...baseProps} amount={{ value: "512120000", denom: "ugnot" }} />);

    // 512.12 GNOT * 0.024 = 12.29088
    expect(markup).toContain("$12.29");
    expect(markup.indexOf("$12.29")).toBeLessThan(markup.indexOf("512.12"));
  });

  it("prices a GRC20 balance by its tokenId", () => {
    const markup = render(
      <AccountAssetItem
        {...baseProps}
        amount={{ value: "100", denom: "GNS" }}
        priceTokenKey="gno.land/r/gnoswap/gns.GNS.0000000"
      />,
    );

    expect(markup).toContain("$50.00");
  });

  it("renders no fiat value for an unpriced token", () => {
    const markup = render(
      <AccountAssetItem {...baseProps} amount={{ value: "100", denom: "FOO" }} priceTokenKey="gno.land/r/demo/foo" />,
    );

    expect(markup).not.toContain("$");
    expect(markup).toContain("100");
  });
});
