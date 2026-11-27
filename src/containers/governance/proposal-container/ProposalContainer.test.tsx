/** @jest-environment jsdom */
import React from "react";
import { act } from "react-dom/test-utils";
import { createRoot, Root } from "react-dom/client";
import { ThemeProvider } from "styled-components";

import theme from "@/styles/theme";
import ProposalContainer from "./ProposalContainer";

let mockCustom = false;
let mockError: Error | null = null;
const mockProposalQuery = jest.fn();
const mockVotesQuery = jest.fn();

jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({
    isCustomNetwork: mockCustom,
    currentNetwork: { chainId: "testnet", apiUrl: "https://api.testnet" },
  }),
}));
jest.mock("@/common/hooks/common/use-list-pagination", () => ({ useListPagination: () => [1, jest.fn()] }));
jest.mock("@/common/react-query/governance/queries", () => ({
  useGetGovernanceProposal: (...args: unknown[]) => {
    mockProposalQuery(...args);
    return { data: undefined, isError: !!mockError, error: mockError, isSuccess: false, refetch: jest.fn() };
  },
  useGetGovernanceProposalVotes: (...args: unknown[]) => {
    mockVotesQuery(...args);
    return { data: undefined, isLoading: true, isError: false, isSuccess: false, refetch: jest.fn() };
  },
}));
jest.mock("@/layouts/governance/ProposalLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
jest.mock("@/components/view/governance/proposal-detail", () => () => null);
jest.mock("@/components/view/governance/proposal-votes", () => () => null);
jest.mock(
  "@/components/view/common/table-skeleton/TableSkeleton",
  () =>
    function TableSkeleton() {
      return <div>Loading proposal</div>;
    },
);

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  mockCustom = false;
  mockError = null;
  mockProposalQuery.mockClear();
  mockVotesQuery.mockClear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const render = (id = "20", isReady = true) => {
  act(() =>
    root.render(
      <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
        <ProposalContainer id={id} isReady={isReady} />
      </ThemeProvider>,
    ),
  );
};

it("does not mount governance query hooks on custom networks", () => {
  mockCustom = true;
  render();
  expect(container.textContent).toContain("not supported on custom networks");
  expect(mockProposalQuery).not.toHaveBeenCalled();
  expect(mockVotesQuery).not.toHaveBeenCalled();
});

it("shows a loading state rather than a not-found result while the route is not ready", () => {
  render("", false);
  expect(container.querySelector("[aria-label=\"Loading proposal\"]")).not.toBeNull();
  expect(mockProposalQuery).toHaveBeenLastCalledWith("", { enabled: false });
  expect(container.textContent).not.toContain("Invalid");
});

it.each(["invalid", "-1", "1.5", "9007199254740992"])("rejects invalid ID %s without enabling requests", id => {
  render(id);
  expect(container.querySelector("[role=\"alert\"]")?.textContent).toContain("Invalid proposal ID");
  expect(mockProposalQuery).toHaveBeenLastCalledWith(id, { enabled: false });
  expect(mockVotesQuery).toHaveBeenLastCalledWith({ id, page: 1, limit: 40 }, { enabled: false });
});

it.each([400, 404, 500])("handles HTTP %s as a meaningful proposal state without nested response data", status => {
  mockError = Object.assign(new Error("Request failed"), { isAxiosError: true, response: { status } });
  render();
  if (status === 400) expect(container.textContent).toContain("Invalid proposal ID");
  else if (status === 404) expect(container.textContent).toContain("Proposal #20 was not found");
  else expect(container.querySelector("[role=\"alert\"]")?.textContent).toContain("Unable to load this proposal");
  expect(container.textContent).not.toContain("No votes yet");
});
