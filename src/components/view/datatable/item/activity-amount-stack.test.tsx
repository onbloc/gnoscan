import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { ActivityAmount } from "@/models/api/activity/activity-model";
import type { TokenMetaFallback, TokenResourceEntry } from "@/common/utils/token.utility";
import { ActivityAmountStack } from "./activity-amount-stack";

// Real resolver over a controllable resource list, so the wugnot override and resource-first rule apply.
const mockResourceMap: Record<string, TokenResourceEntry> = {};
jest.mock("@/common/hooks/common/use-token-resource-meta", () => {
  const { resolveTokenMeta } = jest.requireActual("@/common/utils/token.utility");
  return {
    useTokenResourceMeta: () => ({
      getTokenMeta: (tokenKey: string, fallback: TokenMetaFallback) =>
        resolveTokenMeta(mockResourceMap, tokenKey, fallback),
    }),
  };
});

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

it("shows wugnot with GNOT decimals although the backend reports 0", () => {
  const wugnot: ActivityAmount = {
    denom: "gno.land/r/gnoland/wugnot.wugnot.0000000",
    value: "5000000",
    decimals: 0,
    symbol: "wugnot",
  };
  expect(renderText([wugnot])).toBe("5wugnot");
});

it("prefers the token resource list decimals over the backend ones", () => {
  mockResourceMap["gno.land/r/demo/bubble"] = { name: "Bubble", symbol: "BUBBLE", decimals: 3 };
  const bubble: ActivityAmount = {
    denom: "gno.land/r/demo/bubble.BUBBLE.0000000",
    value: "1917948",
    decimals: 6,
    symbol: "BUBBLE",
  };
  expect(renderText([bubble])).toBe("1,917.948BUBBLE");
  delete mockResourceMap["gno.land/r/demo/bubble"];
});

it("shows GNFT as its collection name with token ids", () => {
  const gnft = (tokenIds: string[]): ActivityAmount => ({
    denom: "gno.land/r/gnoswap/gnft.GNFT.0000000",
    value: String(tokenIds.length),
    decimals: 0,
    symbol: "",
    tokenIds,
  });
  expect(renderText([gnft(["313"])])).toBe("GNFT #313");
  expect(renderText([gnft(["12", "40"])])).toBe("GNFT #12, #40");
});
