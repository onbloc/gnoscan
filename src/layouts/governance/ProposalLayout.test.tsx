/** @jest-environment jsdom */
import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot, Root } from "react-dom/client";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import ProposalLayout from "./ProposalLayout";

jest.mock("@/assets/svgs/icon-arrow.svg", () => () => null);
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (url: string) => `${url}?chainId=testnet` }),
}));

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const render = (prevId: number | null, nextId: number | null) => {
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <ProposalLayout id="20" prevId={prevId} nextId={nextId}>
          <div>Proposal body</div>
        </ProposalLayout>
      </ThemeProvider>,
    ),
  );
};

it("uses nullable API neighbors instead of calculating consecutive IDs", () => {
  render(17, 24);
  expect(container.querySelector('[aria-label="Previous proposal"]')?.getAttribute("href")).toBe(
    "/governance/17?chainId=testnet",
  );
  expect(container.querySelector('[aria-label="Next proposal"]')?.getAttribute("href")).toBe(
    "/governance/24?chainId=testnet",
  );
  expect(container.textContent).toContain("Proposal #20");
  expect(container.textContent).not.toContain("Back");
  expect(container.querySelector('[aria-label*="block"]')).toBeNull();
});

it("renders a disabled previous control at the first proposal and a usable next link", () => {
  render(null, 23);
  const previous = container.querySelector<HTMLButtonElement>('[aria-label="Previous proposal"]');
  expect(previous?.tagName).toBe("BUTTON");
  expect(previous?.disabled).toBe(true);
  expect(previous?.hasAttribute("href")).toBe(false);
  expect(container.querySelector('[aria-label="Next proposal"]')?.getAttribute("href")).toBe(
    "/governance/23?chainId=testnet",
  );
});

it("renders a disabled next control at the latest proposal without disabling proposal zero", () => {
  render(0, null);
  const next = container.querySelector<HTMLButtonElement>('[aria-label="Next proposal"]');
  expect(next?.tagName).toBe("BUTTON");
  expect(next?.disabled).toBe(true);
  expect(next?.hasAttribute("href")).toBe(false);
  expect(container.querySelector('[aria-label="Previous proposal"]')?.getAttribute("href")).toBe(
    "/governance/0?chainId=testnet",
  );
});

it("keeps both controls disabled when no neighbors are known", () => {
  render(null, null);
  expect(container.querySelectorAll("button:disabled")).toHaveLength(2);
  expect(container.querySelectorAll("nav a")).toHaveLength(0);
});
