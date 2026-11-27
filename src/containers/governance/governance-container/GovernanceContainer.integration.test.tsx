/** @jest-environment jsdom */
import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";

import { QUERY_KEY } from "@/common/react-query/query-keys";
import { GovernanceMember, GovernancePage, GovernanceProposal, GovernanceSummary } from "@/models/api/governance";
import { GetGovernanceMembersRequest, GetGovernanceProposalsRequest } from "@/repositories/api/governance/request";
import theme from "@/styles/theme";
import GovernanceContainer from "./GovernanceContainer";

const mockNetwork = { currentNetwork: { chainId: "mainnet" }, isCustomNetwork: false };
const mockRepository = {
  getGovernanceSummary: jest.fn(),
  getGovernanceProposals: jest.fn(),
  getGovernanceMembers: jest.fn(),
};
jest.mock("@/common/hooks/provider/use-network-provider", () => ({ useNetworkProvider: () => mockNetwork }));
jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiGovernanceRepository: mockRepository }),
}));
jest.mock("@/common/hooks/use-network", () => ({ useNetwork: () => ({ getUrlWithNetwork: (path: string) => path }) }));
jest.mock("next/router", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));
jest.mock("@/components/view/datatable/item/address-copy", () => ({
  AddressCopy: ({ address }: { address: string }) => <a href={`/account/${address}`}>{address}</a>,
}));
jest.mock("@/assets/svgs/icon-sort-down.svg", () => () => null);
jest.mock("@/assets/svgs/icon-sort-up.svg", () => () => null);
jest.mock("@/assets/svgs/icon-arrow.svg", () => () => null);
jest.mock("@/assets/svgs/icon-nft-search.svg", () => () => null);
jest.mock("@/assets/svgs/icon-tooltip.svg", () => () => null);
jest.mock("@/assets/svgs/icon-table-loading.svg", () => () => null);
jest.mock("@/assets/svgs/icon-pagination-first.svg", () => () => null);
jest.mock("@/assets/svgs/icon-pagination-previous.svg", () => () => null);
jest.mock(
  "@/components/view/common/table-skeleton/TableSkeleton",
  () =>
    function TableSkeleton() {
      return <div role="status">Loading list</div>;
    },
);

const proposal: GovernanceProposal = {
  id: 20,
  title: "Initial proposal",
  type: "PARAMETER",
  status: "ACCEPTED",
  proposer: { address: null, nameTag: "alice" },
  votes: {
    yes: { percent: null, count: 4, power: 4 },
    no: { percent: null, count: 1, power: 1 },
    abstain: { percent: null, count: 0, power: 0 },
  },
};
const haltProposal: GovernanceProposal = { ...proposal, id: 19, title: "Halt proposal" };
const validatorProposal: GovernanceProposal = { ...proposal, id: 18, title: "Validator proposal" };
const member: GovernanceMember = {
  tier: "T2",
  address: "g1member",
  power: 1.67,
  votes: { yes: 4, no: 1, abstain: 2, total: 7 },
  proposalsAuthored: 3,
};
const nextMember: GovernanceMember = { ...member, address: "g1nextmember" };
const tierDescending: GovernanceMember = { ...member, address: "g1tierdescending", tier: "T3", power: 0.33 };
const tierAscending: GovernanceMember = { ...member, address: "g1tierascending", tier: "T1", power: 3 };
const powerDescending: GovernanceMember = { ...member, address: "g1powerdescending", tier: "T1", power: 3 };
const summary: GovernanceSummary = {
  syncedAt: null,
  proposals: { total: 81, active: 0, accepted: 81, rejected: 0 },
  members: { total: 81, totalPower: 100, tiers: [] },
};
const pageResponse = <T,>(items: T[], totalCount = 81): GovernancePage<T> => ({
  items,
  page: { totalCount, hasNext: totalCount > 40 },
});

let container: HTMLDivElement;
let root: Root;
let client: QueryClient;
let proposalResponse: (request: GetGovernanceProposalsRequest) => Promise<GovernancePage<GovernanceProposal>>;
let memberResponse: (request: GetGovernanceMembersRequest) => Promise<GovernancePage<GovernanceMember>>;

const flush = async (milliseconds = 10) => {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(milliseconds);
  });
};
const mount = async () => {
  act(() =>
    root.render(
      <QueryClientProvider client={client}>
        <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
          <GovernanceContainer />
        </ThemeProvider>
      </QueryClientProvider>,
    ),
  );
  await flush();
};
const click = (label: string) =>
  act(() => container.querySelector<HTMLButtonElement>(`button[aria-label='${label}']`)!.click());
const activateSort = (label: string) => {
  const control = container.querySelector<HTMLButtonElement>(`button[aria-label='Sort by ${label}']`)!;
  act(() => {
    control.focus();
    control.click();
  });
  return control;
};
const changeSearch = (value: string) => {
  const input = container.querySelector<HTMLInputElement>("input[type=search]")!;
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
};
const proposalLink = (id: number) =>
  container.querySelector<HTMLAnchorElement>(`table[aria-label='Governance proposals'] a[href='/governance/${id}']`);
const memberLink = (address: string) =>
  container.querySelector<HTMLAnchorElement>(`table[aria-label='Governance members'] a[href='/account/${address}']`);

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  jest.useFakeTimers();
  window.sessionStorage.clear();
  window.history.replaceState({ key: "governance-scope-entry" }, "", "/governance");
  Object.values(mockRepository).forEach(method => method.mockReset());
  proposalResponse = async () => pageResponse([proposal]);
  memberResponse = async () => pageResponse([member]);
  mockRepository.getGovernanceSummary.mockResolvedValue(summary);
  mockRepository.getGovernanceProposals.mockImplementation((request: GetGovernanceProposalsRequest) => {
    if (request.status === "ACTIVE") return Promise.resolve(pageResponse([], 0));
    if (request.limit === 1) return Promise.resolve(pageResponse([proposal], 1));
    return proposalResponse(request);
  });
  mockRepository.getGovernanceMembers.mockImplementation((request: GetGovernanceMembersRequest) =>
    memberResponse(request),
  );
  client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 60_000 } } });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  client.clear();
  container.remove();
  jest.useRealTimers();
});

it("keeps rows during debounce, then hides previous-search links through unrelated rerenders", async () => {
  const pending = Promise.withResolvers<GovernancePage<GovernanceProposal>>();
  proposalResponse = request => (request.q === "halt" ? pending.promise : Promise.resolve(pageResponse([proposal])));
  await mount();
  const input = container.querySelector<HTMLInputElement>("input[type=search]")!;
  act(() => input.focus());
  changeSearch("  halt  ");
  await flush(299);
  expect(proposalLink(20)).not.toBeNull();
  await flush(1);
  expect(proposalLink(20)).toBeNull();
  expect(document.activeElement).toBe(input);

  act(() =>
    client.setQueryData(["mainnet", QUERY_KEY.getGovernanceSummary], {
      ...summary,
      proposals: { ...summary.proposals, total: 82 },
    }),
  );
  await flush();
  expect(proposalLink(20)).toBeNull();
  pending.resolve(pageResponse([haltProposal], 1));
  await flush();
  expect(proposalLink(19)?.textContent).toBe("Halt proposal");
  expect(proposalLink(20)).toBeNull();
  expect(document.activeElement).toBe(input);
});

it("keeps previous proposal rows for page changes within the same scope", async () => {
  const pending = Promise.withResolvers<GovernancePage<GovernanceProposal>>();
  proposalResponse = request => (request.page === 2 ? pending.promise : Promise.resolve(pageResponse([proposal])));
  await mount();
  const firstLink = proposalLink(20);
  expect(firstLink).not.toBeNull();
  click("Next page");
  await flush();
  expect(proposalLink(20)).toBe(firstLink);
  expect(container.textContent).toContain("Page 2 of 3");
  pending.resolve(pageResponse([haltProposal]));
  await flush();
  expect(proposalLink(20)).toBeNull();
  expect(proposalLink(19)?.textContent).toBe("Halt proposal");
  expect(container.textContent).toContain("Page 2 of 3");
});

it("keeps the focused proposal sort control while replacing stale-order rows", async () => {
  const pending = Promise.withResolvers<GovernancePage<GovernanceProposal>>();
  proposalResponse = request =>
    request.sort === "status" && request.order === "desc" ? pending.promise : Promise.resolve(pageResponse([proposal]));
  await mount();
  const control = activateSort("Status");
  await flush();
  expect(document.activeElement).toBe(control);
  expect(proposalLink(20)).toBeNull();
  pending.resolve(pageResponse([haltProposal]));
  await flush();
  expect(proposalLink(19)).not.toBeNull();
  expect(document.activeElement).toBe(control);
  expect(container.querySelector("th[aria-sort='descending']")?.textContent).toBe("Status");
  expect(container.textContent).toContain("Page 1 of 3");
});

it("preserves paged members but replaces stale-order rows and cycles server-side sort columns", async () => {
  const nextPage = Promise.withResolvers<GovernancePage<GovernanceMember>>();
  const sorted = Promise.withResolvers<GovernancePage<GovernanceMember>>();
  memberResponse = request => {
    if (request.sort === "tier") {
      return request.order === "desc" ? sorted.promise : Promise.resolve(pageResponse([tierAscending]));
    }
    if (request.sort === "power" && request.order === "desc") return Promise.resolve(pageResponse([powerDescending]));
    return request.page === 2 ? nextPage.promise : Promise.resolve(pageResponse([member]));
  };
  await mount();
  act(() =>
    Array.from(container.querySelectorAll("button"))
      .find(button => button.textContent?.startsWith("Members"))!
      .click(),
  );
  await flush();
  const firstLink = memberLink("g1member");
  expect(firstLink).not.toBeNull();
  click("Next page");
  await flush();
  expect(memberLink("g1member")).toBe(firstLink);
  nextPage.resolve(pageResponse([nextMember]));
  await flush();
  expect(memberLink("g1nextmember")).not.toBeNull();

  const control = activateSort("Tier");
  await flush();
  expect(document.activeElement).toBe(control);
  expect(memberLink("g1nextmember")).toBeNull();
  expect(memberLink("g1member")).toBeNull();
  sorted.resolve(pageResponse([tierDescending]));
  await flush();
  expect(memberLink("g1tierdescending")).not.toBeNull();
  expect(document.activeElement).toBe(control);
  expect(container.querySelector("th[aria-sort='descending']")?.textContent).toBe("Tier");
  expect(container.textContent).toContain("Page 1 of 3");

  click("Sort by Tier");
  await flush();
  expect(memberLink("g1tierascending")).not.toBeNull();
  expect(container.querySelector("th[aria-sort='ascending']")?.textContent).toBe("Tier");
  click("Sort by Tier");
  expect(memberLink("g1member")).not.toBeNull();
  expect(container.querySelector("th[aria-sort='ascending'], th[aria-sort='descending']")).toBeNull();
  click("Sort by Tier");
  await flush();
  click("Sort by Voting Power");
  await flush();
  expect(memberLink("g1powerdescending")).not.toBeNull();
  expect(container.querySelector("th[aria-sort='descending']")?.textContent).toBe("Voting Power");
  expect(container.querySelector("th[aria-sort='ascending']")).toBeNull();
});

it("never exposes an earlier search response while a newer search is pending", async () => {
  const halt = Promise.withResolvers<GovernancePage<GovernanceProposal>>();
  const validator = Promise.withResolvers<GovernancePage<GovernanceProposal>>();
  proposalResponse = request => {
    if (request.q === "halt") return halt.promise;
    if (request.q === "validator") return validator.promise;
    return Promise.resolve(pageResponse([proposal]));
  };
  await mount();
  changeSearch("halt");
  await flush(300);
  changeSearch("validator");
  await flush(300);
  halt.resolve(pageResponse([haltProposal], 1));
  await flush();
  expect(proposalLink(20)).toBeNull();
  expect(proposalLink(19)).toBeNull();
  validator.resolve(pageResponse([validatorProposal], 1));
  await flush();
  expect(proposalLink(18)?.textContent).toBe("Validator proposal");
  expect(proposalLink(19)).toBeNull();
  expect(proposalLink(20)).toBeNull();
});

it("shows a fresh cached scope immediately instead of carrying another scope or showing loading", async () => {
  proposalResponse = async request => pageResponse([request.q === "halt" ? haltProposal : proposal]);
  await mount();
  changeSearch("halt");
  await flush(300);
  await flush();
  expect(proposalLink(19)).not.toBeNull();
  changeSearch("");
  await flush(300);
  expect(proposalLink(20)).not.toBeNull();
  changeSearch("halt");
  await flush(300);
  expect(proposalLink(19)).not.toBeNull();
  expect(proposalLink(20)).toBeNull();
});

it("keeps keyboard sorting available while earlier sort requests remain pending", async () => {
  const descending = Promise.withResolvers<GovernancePage<GovernanceProposal>>();
  const ascending = Promise.withResolvers<GovernancePage<GovernanceProposal>>();
  proposalResponse = request => {
    if (request.sort === "status") return request.order === "desc" ? descending.promise : ascending.promise;
    return Promise.resolve(pageResponse([proposal]));
  };
  await mount();
  const control = activateSort("Status");
  await flush();
  expect(document.activeElement).toBe(control);
  expect(proposalLink(20)).toBeNull();

  click("Sort by Status");
  await flush();
  expect(document.activeElement).toBe(control);
  expect(container.querySelector("th[aria-sort='ascending']")?.textContent).toBe("Status");
  expect(proposalLink(20)).toBeNull();

  click("Sort by Status");
  expect(document.activeElement).toBe(control);
  expect(proposalLink(20)).not.toBeNull();
  descending.resolve(pageResponse([haltProposal]));
  ascending.resolve(pageResponse([validatorProposal]));
  await flush();
  expect(document.activeElement).toBe(control);
  expect(proposalLink(20)).not.toBeNull();
  expect(proposalLink(19)).toBeNull();
  expect(proposalLink(18)).toBeNull();
});

it("does not steal external focus when a sorted response arrives", async () => {
  const pending = Promise.withResolvers<GovernancePage<GovernanceProposal>>();
  proposalResponse = request =>
    request.sort === "status" ? pending.promise : Promise.resolve(pageResponse([proposal]));
  await mount();
  activateSort("Status");
  const input = container.querySelector<HTMLInputElement>("input[type=search]")!;
  act(() => input.focus());
  pending.resolve(pageResponse([haltProposal]));
  await flush();
  expect(proposalLink(19)).not.toBeNull();
  expect(document.activeElement).toBe(input);
});

it("keeps the sort header usable through an error and retry", async () => {
  let failSort = true;
  const recovery = Promise.withResolvers<GovernancePage<GovernanceProposal>>();
  proposalResponse = request => {
    if (request.sort !== "status") return Promise.resolve(pageResponse([proposal]));
    return failSort ? Promise.reject(new Error("Sort unavailable")) : recovery.promise;
  };
  await mount();
  const control = activateSort("Status");
  await flush();
  expect(document.activeElement).toBe(control);
  expect(proposalLink(20)).toBeNull();
  const retry = container.querySelector<HTMLButtonElement>("tbody [role='alert'] button")!;
  failSort = false;
  act(() => {
    retry.focus();
    retry.click();
  });
  await flush();
  act(() => control.focus());
  expect(document.activeElement).toBe(control);
  expect(proposalLink(20)).toBeNull();
  recovery.resolve(pageResponse([haltProposal]));
  await flush();
  expect(proposalLink(19)).not.toBeNull();
  expect(document.activeElement).toBe(control);
  expect(container.querySelector("tbody [role='alert']")).toBeNull();
});
