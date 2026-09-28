import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { ActivityAmount } from "@/models/api/activity/activity-model";
import { ActivityAmountStack } from "./activity-amount-stack";

const gnot = (value: string): ActivityAmount => ({ denom: "ugnot", value, decimals: 6, symbol: "GNOT" });

const renderText = (amounts: ActivityAmount[]) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <ActivityAmountStack amounts={amounts} />
    </ThemeProvider>,
  ).replace(/<[^>]*>/g, "");

it("shows a dash when there are no amounts or every amount is zero", () => {
  expect(renderText([])).toBe("-");
  expect(renderText([gnot("0")])).toBe("-");
});

it("hides zero amounts but keeps nonzero ones", () => {
  const text = renderText([gnot("0"), gnot("1500000")]);
  expect(text).toContain("1.5");
  expect(text).toContain("GNOT");
});
