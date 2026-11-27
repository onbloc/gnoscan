/** @jest-environment jsdom */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { ThemeProvider } from "styled-components";

import { GovernanceMember, GovernanceProposal, GovernanceSummary } from "@/models/api/governance";
import theme from "@/styles/theme";
import GovernanceContainer from "./GovernanceContainer";

const mockUseSummary = jest.fn();
const mockUseLive = jest.fn();
const mockUseProposals = jest.fn();
const mockUseMembers = jest.fn();
const mockPush = jest.fn();
let mockNetwork = { currentNetwork: { chainId: "mainnet" }, isCustomNetwork: false };

jest.mock("@/common/react-query/governance/queries", () => ({
  useGetGovernanceSummary: (...args: unknown[]) => mockUseSummary(...args),
  useGetLiveGovernanceProposals: (...args: unknown[]) => mockUseLive(...args),
  useGetGovernanceProposals: (...args: unknown[]) => mockUseProposals(...args),
  useGetGovernanceMembers: (...args: unknown[]) => mockUseMembers(...args),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => mockNetwork,
}));
jest.mock("@/common/hooks/use-network", () => ({
  useNetwork: () => ({ getUrlWithNetwork: (path: string) => `${path}?chainId=${mockNetwork.currentNetwork.chainId}` }),
}));
jest.mock("next/router", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("@/common/hooks/detail-tabs/use-history-entry-state", () => ({
  useHistoryEntryState: (_name: string, initial: unknown) => jest.requireActual("react").useState(initial),
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));
jest.mock("@/components/view/datatable/item/address-copy", () => ({
  AddressCopy: ({ address }: { address: string }) => <a href={`/account/${address}`}>{address}</a>,
}));
jest.mock("@/components/view/common/list-pagination/ListPagination", () => ({
  ListPagination: ({ page, onChangePage }: { page: number; onChangePage: (page: number) => void }) => (
    <div>
      <span data-current-page>{page}</span>
      <button aria-label="Next page" onClick={() => onChangePage(page + 1)}>
        Next
      </button>
    </div>
  ),
}));
jest.mock("@/assets/svgs/icon-sort-down.svg", () => () => null);
jest.mock("@/assets/svgs/icon-sort-up.svg", () => () => null);
jest.mock("@/assets/svgs/icon-nft-search.svg", () => () => null);
jest.mock("@/assets/svgs/icon-tooltip.svg", () => () => null);
jest.mock("@/assets/svgs/icon-table-loading.svg", () => () => null);
jest.mock(
  "@/components/view/common/table-skeleton/TableSkeleton",
  () =>
    function TableSkeleton() {
      return <div role="status">Loading list</div>;
    },
);

const proposal: GovernanceProposal = {
  id: 20,
  title: "Add &amp; review validators",
  type: "VALIDATOR_SET",
  status: "ACTIVE",
  proposer: { address: "g1proposer", nameTag: "alice" },
  votes: {
    yes: { percent: 40, count: 4, power: 4 },
    no: { percent: 10, count: 1, power: 1 },
    abstain: { percent: 0, count: 0, power: 0 },
  },
};
const member: GovernanceMember = {
  tier: "T2",
  address: "g1member",
  power: 1.67,
  votes: { yes: 4, no: 1, abstain: 2, total: 7 },
  proposalsAuthored: 3,
};
const summary: GovernanceSummary = {
  syncedAt: null,
  proposals: { total: 45, active: 1, accepted: 40, rejected: 4 },
  members: { total: 41, totalPower: 100, tiers: [] },
};
const success = { isSuccess: true, isError: false, isPreviousData: false };
let container: HTMLDivElement;
let root: Root;

const render = () =>
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <GovernanceContainer />
      </ThemeProvider>,
    ),
  );
const click = (selector: string) => act(() => container.querySelector<HTMLElement>(selector)!.click());
const selectMembers = () => {
  const button = Array.from(container.querySelectorAll("button")).find(item =>
    item.textContent?.startsWith("Members"),
  )!;
  act(() => button.click());
};
const lastProposalRequest = () => {
  const calls = mockUseProposals.mock.calls.filter(([params]) => params.limit === 40);
  return calls[calls.length - 1][0];
};
const changeSearch = (value: string) => {
  const input = container.querySelector<HTMLInputElement>("input[type=search]")!;
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  mockNetwork = { currentNetwork: { chainId: "mainnet" }, isCustomNetwork: false };
  mockUseSummary.mockReturnValue({ ...success, data: summary });
  mockUseLive.mockReturnValue({ ...success, data: [proposal] });
  mockUseProposals.mockReturnValue({
    ...success,
    data: { items: [proposal], page: { totalCount: 45, hasNext: true } },
  });
  mockUseMembers.mockReturnValue({ ...success, data: { items: [member], page: { totalCount: 41, hasNext: true } } });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.useRealTimers();
});

it("cycles proposal sort descending, ascending, then omitted and starts another column descending", () => {
  render();
  expect(lastProposalRequest()).not.toHaveProperty("sort");
  expect(lastProposalRequest()).not.toHaveProperty("order");

  click("button[aria-label='Next page']");
  expect(lastProposalRequest().page).toBe(2);
  click("button[aria-label='Sort by ID']");
  expect(lastProposalRequest()).toMatchObject({ sort: "id", order: "desc" });
  expect(container.querySelector("th")!.getAttribute("aria-sort")).toBe("descending");
  click("button[aria-label='Sort by ID']");
  expect(lastProposalRequest()).toMatchObject({ sort: "id", order: "asc" });
  click("button[aria-label='Sort by ID']");
  expect(lastProposalRequest()).not.toHaveProperty("sort");
  expect(lastProposalRequest()).not.toHaveProperty("order");
  expect(container.querySelector("th")!.getAttribute("aria-sort")).toBe("none");
  expect(lastProposalRequest().page).toBe(1);

  click("button[aria-label='Sort by ID']");
  click("button[aria-label='Sort by ID']");
  click("button[aria-label='Sort by Status']");
  expect(lastProposalRequest()).toMatchObject({ sort: "status", order: "desc" });
  expect(container.querySelector("th")!.getAttribute("aria-sort")).toBe("none");
});

it("debounces the trimmed q request by 300ms and resets its page, including clearing the keyword", () => {
  render();
  click("button[aria-label='Next page']");
  expect(lastProposalRequest().page).toBe(2);
  changeSearch("  val  ");
  act(() => void jest.advanceTimersByTime(299));
  expect(lastProposalRequest()).not.toHaveProperty("q");
  expect(lastProposalRequest().page).toBe(2);
  act(() => void jest.advanceTimersByTime(1));
  expect(lastProposalRequest()).toMatchObject({ q: "val", page: 1 });

  changeSearch("validator");
  act(() => void jest.advanceTimersByTime(200));
  changeSearch("validators");
  act(() => void jest.advanceTimersByTime(299));
  expect(lastProposalRequest().q).toBe("val");
  act(() => void jest.advanceTimersByTime(1));
  expect(lastProposalRequest().q).toBe("validators");

  changeSearch("   ");
  act(() => void jest.advanceTimersByTime(300));
  expect(lastProposalRequest()).not.toHaveProperty("q");
  expect(lastProposalRequest().page).toBe(1);
});

it("resets proposal pagination when sort changes and pages members beyond forty", () => {
  render();
  click("button[aria-label='Next page']");
  click("button[aria-label='Sort by Status']");
  expect(lastProposalRequest()).toMatchObject({ page: 1, sort: "status", order: "desc" });
  selectMembers();
  expect(container.querySelector("input[type=search]")).toBeNull();
  expect(container.querySelector("table[aria-label='Governance members']")!.textContent).toContain("Proposed");
  expect(container.textContent).toContain("1.67");
  expect(container.textContent).toContain("Yes 4 · No 1 · Abstain 2");
  click("button[aria-label='Next page']");
  expect(mockUseMembers).toHaveBeenLastCalledWith({ page: 2, limit: 40 }, expect.objectContaining({ enabled: true }));
  click("button[aria-label='Sort by Tier']");
  expect(mockUseMembers).toHaveBeenLastCalledWith(
    { page: 1, limit: 40, sort: "tier", order: "desc" },
    expect.anything(),
  );
  click("button[aria-label='Sort by Tier']");
  expect(mockUseMembers).toHaveBeenLastCalledWith(
    expect.objectContaining({ sort: "tier", order: "asc" }),
    expect.anything(),
  );
  click("button[aria-label='Sort by Tier']");
  expect(mockUseMembers).toHaveBeenLastCalledWith({ page: 1, limit: 40 }, expect.anything());
  click("button[aria-label='Sort by Tier']");
  click("button[aria-label='Sort by Voting Power']");
  expect(mockUseMembers).toHaveBeenLastCalledWith(
    expect.objectContaining({ sort: "power", order: "desc" }),
    expect.anything(),
  );
});

it("navigates proposal rows by click, Enter and Space without hijacking nested links", () => {
  render();
  const row = container.querySelector<HTMLElement>("tr[aria-label='View proposal #20']")!;
  expect(row.tabIndex).toBe(0);
  expect(row.textContent).toContain("Add & review validators");
  act(() => row.click());
  act(() => row.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
  const space = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
  act(() => row.dispatchEvent(space));
  expect(space.defaultPrevented).toBe(true);
  expect(mockPush).toHaveBeenCalledTimes(3);
  expect(mockPush).toHaveBeenLastCalledWith("/governance/20?chainId=mainnet");

  const titleLink = row.querySelector<HTMLAnchorElement>("a[href^='/governance/']")!;
  act(() => titleLink.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
  act(() => titleLink.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
  expect(mockPush).toHaveBeenCalledTimes(3);
});

it("navigates whole live items by click and keyboard without hijacking their title links", () => {
  render();
  const item = container.querySelector<HTMLElement>("article[aria-label='View live proposal #20']")!;
  expect(item.getAttribute("role")).toBe("link");
  expect(item.tabIndex).toBe(0);
  expect(item.querySelectorAll("a")).toHaveLength(1);
  act(() => item.click());
  act(() => item.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
  const space = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
  act(() => item.dispatchEvent(space));
  expect(space.defaultPrevented).toBe(true);
  expect(mockPush).toHaveBeenCalledTimes(3);
  expect(mockPush).toHaveBeenLastCalledWith("/governance/20?chainId=mainnet");

  const titleLink = item.querySelector<HTMLAnchorElement>("a[href^='/governance/']")!;
  act(() => titleLink.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
  act(() => titleLink.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
  expect(mockPush).toHaveBeenCalledTimes(3);
});

it.each([
  { address: "g1proposer", nameTag: "@alice", expected: "alice" },
  { address: null, nameTag: "alice", expected: "alice" },
  {
    address: "g1aeddlftlfk27ret5rf750d7w5dume3kcsm8r8m",
    nameTag: null,
    expected: "g1aeddlf...kcsm8r8m",
  },
  { address: "g1short", nameTag: null, expected: "g1short" },
  { address: "g1proposer", nameTag: "@long-governance-proposer-name", expected: "long-governance-proposer-name" },
  { address: null, nameTag: null, expected: "-" },
])("shows the proposer as plain text for $address and $nameTag", ({ address, nameTag, expected }) => {
  mockUseProposals.mockReturnValue({
    ...success,
    data: {
      items: [{ ...proposal, proposer: { address, nameTag } }],
      page: { totalCount: 1, hasNext: false },
    },
  });
  render();
  const proposer = container.querySelector("table[aria-label='Governance proposals'] tbody tr td:nth-child(3)")!;
  expect(proposer.textContent).toBe(expected);
  expect(proposer.querySelector("a, button")).toBeNull();
  if (address && !nameTag) {
    expect(proposer.querySelector("span")?.getAttribute("title")).toBe(address);
  }
});

it("shows the latest proposal's real rejected status when none are active", () => {
  mockUseLive.mockReturnValue({ ...success, data: [] });
  mockUseProposals.mockImplementation(params => ({
    ...success,
    data: {
      items: params.limit === 1 ? [{ ...proposal, status: "REJECTED" }] : [],
      page: { totalCount: 1, hasNext: false },
    },
  }));
  render();
  expect(mockUseProposals).toHaveBeenCalledWith({ page: 1, limit: 1 }, expect.objectContaining({ enabled: true }));
  const liveCard = Array.from(container.querySelectorAll("section")).find(section =>
    section.querySelector("h3")?.textContent?.startsWith("Live Proposals"),
  )!;
  expect(liveCard.querySelector("h3 span")!.textContent).toBe("0");
  const latestLink = liveCard.querySelector<HTMLAnchorElement>("a[href='/governance/20?chainId=mainnet']")!;
  expect(latestLink.textContent).toContain("#20 Add & review validators");
  expect(liveCard.querySelector("small")!.textContent).toContain("Rejected");
  expect(liveCard.querySelector("small")!.textContent).not.toContain("Accepted");
  expect(liveCard.querySelector("[role='img']")).toBeNull();
  expect(liveCard.querySelector("a[href^='/account/']")).toBeNull();
  expect(liveCard.textContent).not.toContain("No proposals yet");
});

it("distinguishes zero proposals from loading and errors", () => {
  mockUseLive.mockReturnValue({ ...success, data: [] });
  mockUseProposals.mockReturnValue({ ...success, data: { items: [], page: { totalCount: 0, hasNext: false } } });
  render();
  expect(container.textContent).toContain("No proposals yet");
  mockUseLive.mockReturnValue({ isSuccess: false, isError: true, data: undefined });
  render();
  expect(container.textContent).toContain("Unable to load proposals.");
  expect(container.textContent).not.toContain("No proposals yet");
  mockUseLive.mockReturnValue({ isSuccess: false, isError: false, data: undefined });
  render();
  expect(container.textContent).toContain("Loading proposals…");
  expect(container.textContent).not.toContain("No proposals yet");
});

it("supports mainnet and testnet, remounts the network's sort and page, and makes no requests on custom", () => {
  render();
  click("button[aria-label='Sort by ID']");
  click("button[aria-label='Next page']");
  expect(lastProposalRequest()).toMatchObject({ page: 2, sort: "id", order: "desc" });
  mockNetwork = { currentNetwork: { chainId: "testnet" }, isCustomNetwork: false };
  render();
  expect(lastProposalRequest()).toEqual({ page: 1, limit: 40 });
  expect(container.textContent).not.toContain("not supported");
  expect(container.querySelector("a[href='/governance/20?chainId=testnet']")).not.toBeNull();

  jest.clearAllMocks();
  mockNetwork = { currentNetwork: { chainId: "custom" }, isCustomNetwork: true };
  render();
  expect(container.textContent).toContain("Governance is not supported on custom networks.");
  expect(mockUseSummary).not.toHaveBeenCalled();
  expect(mockUseLive).not.toHaveBeenCalled();
  expect(mockUseProposals).not.toHaveBeenCalled();
  expect(mockUseMembers).not.toHaveBeenCalled();
});
