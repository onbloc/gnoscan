import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import theme from "@/styles/theme";
import AccountAssetItem from "./AccountAssetItem";

jest.mock("@/assets/svgs/icon-unknown-token.svg", () => "svg");
jest.mock("@/assets/svgs/icon-link.svg", () => "svg");

const mockPrices = { data: undefined as unknown };

jest.mock("@/common/hooks/common/use-token-meta", () => ({
  useTokenMeta: () => ({
    getTokenImage: () => undefined,
    getTokenAmount: (denom: string, value: string) => ({ denom, value }),
    getTokenInfo: (denom: string) => ({ name: denom }),
  }),
}));

jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }),
}));

jest.mock("@/common/react-query/price", () => ({
  useGetPrices: () => mockPrices,
}));

const assetProps = {
  amount: { value: "512.12", denom: "GNOT" },
  breakpoint: DEVICE_TYPE.DESKTOP,
  isDesktop: true,
  isFetched: true,
};

beforeEach(() => {
  mockPrices.data = {
    items: [{ assetId: "gno.land/r/gnoland/wugnot.wugnot", provider: "gnoswap", price: "0.024", status: "fresh" }],
  };
});

describe("AccountAssetItem", () => {
  it("renders the fiat value above the asset quantity", () => {
    const markup = renderToStaticMarkup(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <AccountAssetItem {...assetProps} priceTokenKey="ugnot" />
      </ThemeProvider>,
    ).replace(/<[^>]*>/g, "");

    expect(markup).toContain("$12.29");
    expect(markup.indexOf("$12.29")).toBeLessThan(markup.indexOf("512.12"));
  });

  it("renders a dash when no fiat value is available", () => {
    const markup = renderToStaticMarkup(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <AccountAssetItem {...assetProps} priceTokenKey="gno.land/r/demo/foo" />
      </ThemeProvider>,
    ).replace(/<[^>]*>/g, "");

    expect(markup).toContain("-");
  });
});
