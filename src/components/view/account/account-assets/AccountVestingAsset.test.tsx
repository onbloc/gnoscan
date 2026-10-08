import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import theme from "@/styles/theme";
import AccountVestingAsset from "./AccountVestingAsset";

jest.mock("@/assets/svgs/icon-unknown-token.svg", () => "svg");
jest.mock("@/assets/svgs/icon-chevron.svg", () => "svg");
jest.mock("@/assets/svgs/icon-lock-asset.svg", () => "svg");

const mockPrices = { data: undefined as unknown };

jest.mock("@/common/hooks/common/use-token-meta", () => ({
  GNOTToken: { denom: "ugnot", symbol: "GNOT", name: "Gno.land", decimals: 6 },
  useTokenMeta: () => ({
    getTokenAmount: () => ({ value: "512.12", denom: "GNOT" }),
    getTokenImage: () => undefined,
    getTokenInfo: () => ({ name: "Gno.land" }),
  }),
}));

jest.mock("@/common/react-query/price", () => ({
  useGetPrices: () => mockPrices,
}));

const vesting = {
  startTime: null,
  type: "continuous" as const,
  originalVesting: "512120000",
  endTime: "2028-09-12T15:00:00Z",
  total: "512120000",
  vested: "0",
  locked: "512120000",
  available: "0",
  blockTime: "2026-10-08T00:00:00Z",
  updatedAt: "2026-10-08T00:00:00Z",
  progress: 0,
  isStale: false,
};

describe("AccountVestingAsset", () => {
  it("renders the fiat value above the locked token quantity", () => {
    mockPrices.data = {
      items: [{ assetId: "gno.land/r/gnoland/wugnot.wugnot", provider: "gnoswap", price: "0.024", status: "fresh" }],
    };

    const markup = renderToStaticMarkup(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <AccountVestingAsset vesting={vesting} breakpoint={DEVICE_TYPE.DESKTOP} isDesktop={true} />
      </ThemeProvider>,
    ).replace(/<[^>]*>/g, "");

    expect(markup).toContain("$12.29");
    expect(markup.indexOf("$12.29")).toBeLessThan(markup.indexOf("512.12"));
  });

  it("renders a dash when the fiat value is unavailable", () => {
    mockPrices.data = { items: [] };

    const markup = renderToStaticMarkup(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <AccountVestingAsset vesting={vesting} breakpoint={DEVICE_TYPE.DESKTOP} isDesktop={true} />
      </ThemeProvider>,
    ).replace(/<[^>]*>/g, "");

    expect(markup).toContain("-");
  });
});
