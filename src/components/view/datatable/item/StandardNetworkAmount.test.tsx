import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { useTokenMetaAmount } from "@/common/hooks/tokens/use-token-meta-amount";
import { StandardNetworkAmount } from "./StandardNetworkAmount";

jest.mock("@/common/hooks/tokens/use-token-meta-amount", () => ({
  useTokenMetaAmount: jest.fn(),
}));

const mockUseTokenMetaAmount = jest.mocked(useTokenMetaAmount);

it("shows a dash for zero transfers even while token metadata is loading", () => {
  mockUseTokenMetaAmount.mockReturnValue({ amount: null, isLoading: true, isFetched: false });

  for (const value of ["0", "0.000000", "0e18"]) {
    const html = renderToStaticMarkup(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <StandardNetworkAmount data={{ value, denom: "gno.land/r/demo/token" }} />
      </ThemeProvider>,
    );
    expect(html.replace(/<[^>]*>/g, "")).toBe("-");
  }
});

it("does not hide a nonzero transfer when its display amount rounds to zero", () => {
  mockUseTokenMetaAmount.mockReturnValue({
    amount: { value: "0.000000", denom: "TOKEN" },
    isLoading: false,
    isFetched: true,
  });

  const html = renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <StandardNetworkAmount data={{ value: "1", denom: "gno.land/r/demo/token" }} />
    </ThemeProvider>,
  );
  expect(html.replace(/<[^>]*>/g, "")).toBe("0.000000TOKEN");
});
