/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import { NftPositionModel } from "@/repositories/api/token/response";
import NftPositionInfo from "./NftPositionInfo";

jest.mock("../../transaction/transaction-message-summary/transfer-render", () => ({
  useTokenInfosByKeys: () => ({}),
  getTokenSymbol: (tokenKey: string) => tokenKey.split(".").pop(),
}));

const POSITION: NftPositionModel = {
  poolPath: "gno.land/r/gnoswap/gns.GNS:gno.land/r/gnoland/wugnot.wugnot:3000",
  liquidity: "567163647",
  feeTier: 3000,
  tickLower: -887220,
  tickUpper: 887220,
  burned: false,
  staked: true,
};

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(position: NftPositionModel | null | undefined, holderAddress?: string) {
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <NftPositionInfo nftId="1142" position={position} holderAddress={holderAddress} />
      </ThemeProvider>,
    ),
  );
}

function boxes() {
  return [...container.querySelectorAll("dl")].map(box => ({
    label: box.querySelector("dt")?.textContent,
    value: box.querySelector("dd")?.textContent,
    href: box.querySelector("a")?.getAttribute("href") ?? null,
  }));
}

it("shows the pool, fee tier and range, linking the pool and this position on gnoswap", () => {
  render(POSITION, "g1operator");
  const poolUrl = `https://gnoswap.io/earn/pool?poolPath=${encodeURIComponent(POSITION.poolPath)}`;

  expect(container.querySelector("h4")?.textContent).toBe("Pool & Position Information");
  expect(boxes()).toEqual([
    { label: "Pool", value: "GNS / WUGNOT", href: poolUrl },
    { label: "Fee Tier", value: "0.3%", href: null },
    { label: "Range", value: "-887220 ~ 887220", href: `${poolUrl}&addr=g1operator#1142` },
  ]);
});

it("shows a dash for a GNFT without an indexed position and nothing while it loads", () => {
  render(null);
  expect(boxes()).toEqual([]);
  expect(container.querySelector("p")?.textContent).toBe("-");

  render(undefined);
  expect(boxes()).toEqual([]);
  expect(container.querySelector("p")).toBeNull();
});
