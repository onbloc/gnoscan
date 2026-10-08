import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { UsdValueText } from "./usd-value-text";

const mockPrices = { data: undefined as unknown };
jest.mock("@/common/react-query/price", () => ({
  useGetPrices: () => mockPrices,
}));

const renderText = (tokenKey: string, amount: string) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <UsdValueText tokenKey={tokenKey} amount={amount} />
    </ThemeProvider>,
  )
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<");

beforeEach(() => {
  mockPrices.data = { ugnot: { price: "0.024" } };
});

it("renders the USD value in parentheses", () => {
  // 512.12 * 0.024 = 12.29088
  expect(renderText("ugnot", "512.12")).toBe("($12.29)");
});

it("renders the floor for a value below $0.001", () => {
  // 0.01 * 0.024 = 0.00024
  expect(renderText("ugnot", "0.01")).toBe("(<\u00A0$0.001)");
});

it("renders nothing for an unpriced token", () => {
  expect(renderText("gno.land/r/demo/foo", "1")).toBe("");
});

it("renders nothing for a zero amount", () => {
  expect(renderText("ugnot", "0")).toBe("");
});

it("renders nothing before prices load", () => {
  mockPrices.data = undefined;
  expect(renderText("ugnot", "1")).toBe("");
});
