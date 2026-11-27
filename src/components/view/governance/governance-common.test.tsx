/** @jest-environment jsdom */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import type { GovernanceVotes } from "@/models/api/governance";
import { GovernanceAccountView, VoteBreakdown } from "./governance-common";

jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (path: string) => `${path}?network=testnet` }),
}));
jest.mock("@/components/view/datatable/item/address-copy", () => ({ AddressCopy: () => null }));

let container: HTMLDivElement;
let root: Root;
const votes: GovernanceVotes = {
  yes: { count: 3, power: 9, percent: 31.25 },
  no: { count: 1, power: 3, percent: 6.5 },
  abstain: { count: 0, power: 0, percent: 0 },
};
const render = (children: React.ReactNode) =>
  act(() =>
    root.render(<ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts }}>{children}</ThemeProvider>),
  );

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

it.each(["ACTIVE", "ACCEPTED"] as const)(
  "preserves eligible-power percentages for %s instead of normalizing to 100",
  status => {
    render(<VoteBreakdown votes={votes} status={status} />);
    expect(container.textContent).toContain("Yes 31.25%");
    expect(container.textContent).toContain("No 6.5%");
    expect(container.textContent).toContain("Abstain 0%");
    const segments = container.querySelectorAll<HTMLElement>("[role=\"img\"] > span");
    expect(Array.from(segments, segment => segment.style.width)).toEqual(["31.25%", "6.5%", "0%"]);
  },
);

it("falls back to counts and count-relative widths when closed percentages are incomplete", () => {
  render(<VoteBreakdown votes={{ ...votes, yes: { ...votes.yes, percent: null } }} status="ACCEPTED" />);
  expect(container.textContent).toBe("Yes 3No 1Abstain 0");
  expect(
    Array.from(container.querySelectorAll<HTMLElement>("[role=\"img\"] > span"), segment => segment.style.width),
  ).toEqual(["75%", "25%", "0%"]);
});

it("does not misrepresent an unknown active percentage as zero or a count-derived power ratio", () => {
  render(<VoteBreakdown votes={{ ...votes, no: { ...votes.no, percent: null } }} status="ACTIVE" />);
  expect(container.textContent).toContain("Yes -No -Abstain -");
  expect(container.textContent).toContain("Voting power unavailable");
  expect(container.querySelector("[role=\"img\"]")?.children.length).toBe(0);
});

it("renders zero closed votes with an empty track and no invalid widths", () => {
  const zero = { count: 0, power: 0, percent: null };
  render(<VoteBreakdown votes={{ yes: zero, no: zero, abstain: zero }} status="REJECTED" />);
  expect(container.textContent).toBe("Yes 0No 0Abstain 0");
  expect(
    Array.from(container.querySelectorAll<HTMLElement>("[role=\"img\"] > span"), segment => segment.style.width),
  ).toEqual(["0%", "0%", "0%"]);
});

it("keeps an unresolved proposer as plain text without an account link", () => {
  render(<GovernanceAccountView account={{ address: null, nameTag: "moul" }} />);
  expect(container.textContent).toBe("@moul");
  expect(container.querySelector("a")).toBeNull();
});

it("links a resolved proposer on the selected network", () => {
  render(<GovernanceAccountView account={{ address: "g1member", nameTag: "moul" }} />);
  expect(container.querySelector("a")?.getAttribute("href")).toBe("/account/g1member?network=testnet");
  expect(container.querySelector("a")?.textContent).toBe("@moul");
});
