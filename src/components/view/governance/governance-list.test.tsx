/** @jest-environment jsdom */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import type { GovernanceProposal } from "@/models/api/governance";
import theme from "@/styles/theme";
import { GovernanceSummaryCards } from "./governance-list";

jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (path: string) => `${path}?chainId=mainnet` }),
}));
jest.mock("next/router", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));
jest.mock("@/assets/svgs/icon-arrow.svg", () => () => null);
jest.mock("@/assets/svgs/icon-sort-down.svg", () => () => null);
jest.mock("@/assets/svgs/icon-sort-up.svg", () => () => null);
jest.mock("@/assets/svgs/icon-tooltip.svg", () => () => null);
jest.mock("@/assets/svgs/icon-table-loading.svg", () => () => null);
jest.mock("@/components/view/datatable/item/address-copy", () => ({ AddressCopy: () => null }));

const proposals: GovernanceProposal[] = [31, 32, 33].map(id => ({
  id,
  title: `Proposal ${id} &amp; members`,
  type: "OTHER",
  status: "ACTIVE",
  proposer: { address: "g1proposer", nameTag: null },
  votes: {
    yes: { percent: 40, count: 4, power: 4 },
    no: { percent: 10, count: 1, power: 1 },
    abstain: { percent: 0, count: 0, power: 0 },
  },
}));
let container: HTMLDivElement;
let root: Root;
const render = (props: Partial<React.ComponentProps<typeof GovernanceSummaryCards>> = {}) =>
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts }}>
        <GovernanceSummaryCards
          summaryError={false}
          live={proposals}
          liveError={false}
          latest={[]}
          latestError={false}
          {...props}
        />
      </ThemeProvider>,
    ),
  );
const button = (direction: string) =>
  container.querySelector<HTMLButtonElement>(`button[aria-label='${direction} live proposal']`);
const viewport = () => container.querySelector<HTMLElement>("[aria-roledescription='carousel']")!;
const scroll = (left: number) => {
  const element = viewport();
  Object.defineProperty(element, "clientWidth", { configurable: true, value: 400 });
  Array.from(element.children).forEach((slide, index) => {
    Object.defineProperty(slide, "offsetLeft", { configurable: true, value: 100 + index * 416 });
  });
  act(() => {
    element.scrollLeft = left;
    element.dispatchEvent(new Event("scroll"));
  });
};

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

it("disables the correct navigation boundary after forward and backward swipes", () => {
  render();
  expect(button("Previous")?.disabled).toBe(true);
  expect(button("Next")?.disabled).toBe(false);

  scroll(416);
  expect(button("Previous")?.disabled).toBe(false);
  expect(button("Next")?.disabled).toBe(false);
  scroll(832);
  expect(button("Previous")?.disabled).toBe(false);
  expect(button("Next")?.disabled).toBe(true);
  scroll(416);
  expect(button("Previous")?.disabled).toBe(false);
  expect(button("Next")?.disabled).toBe(false);
  scroll(0);
  expect(button("Previous")?.disabled).toBe(true);
  expect(button("Next")?.disabled).toBe(false);
});

it("keeps the next proposal available until the last slide is nearer across the gap", () => {
  render();
  scroll(616);
  expect(button("Previous")?.disabled).toBe(false);
  expect(button("Next")?.disabled).toBe(false);
  scroll(632);
  expect(button("Next")?.disabled).toBe(true);
});

it("keeps navigation bounded during touch overscroll", () => {
  render();
  scroll(-400);
  expect(button("Previous")?.disabled).toBe(true);
  scroll(1200);
  expect(button("Next")?.disabled).toBe(true);
});

it("returns to the first available proposal when the active list changes", () => {
  render();
  scroll(832);
  render({ live: proposals.slice(1) });
  expect(viewport().scrollLeft).toBe(0);
  expect(button("Previous")?.disabled).toBe(true);
  expect(button("Next")?.disabled).toBe(false);
  expect(viewport().querySelector("a")?.textContent).toBe("#32 Proposal 32 & members");
});

it("keeps a single proposal linked without showing unnecessary navigation", () => {
  render({ live: [proposals[0]] });
  expect(button("Previous")).toBeNull();
  expect(button("Next")).toBeNull();
  expect(viewport().querySelector("a")?.getAttribute("href")).toBe("/governance/31?chainId=mainnet");
});

it("keeps the empty live state and latest proposal link without carousel controls", () => {
  render({ live: [], latest: [{ ...proposals[0], status: "ACCEPTED" }] });
  expect(container.textContent).toContain("No active proposals");
  expect(container.textContent).toContain("Accepted");
  expect(container.querySelector("a")?.getAttribute("href")).toBe("/governance/31?chainId=mainnet");
  expect(viewport()).toBeNull();
  expect(button("Previous")).toBeNull();
  expect(button("Next")).toBeNull();
});

it.each([
  { props: { live: undefined }, role: "status", message: "Loading proposals…" },
  { props: { liveError: true }, role: "alert", message: "Unable to load proposals." },
])("hides carousel navigation while showing $message", ({ props, role, message }) => {
  render(props);
  expect(Array.from(container.querySelectorAll(`[role='${role}']`), element => element.textContent)).toContain(message);
  expect(viewport()).toBeNull();
  expect(button("Previous")).toBeNull();
  expect(button("Next")).toBeNull();
});
