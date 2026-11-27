/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setTimeout as delay } from "node:timers/promises";
import {
  useGetGovernanceMembers,
  useGetGovernanceProposal,
  useGetGovernanceProposals,
  useGetGovernanceProposalVotes,
  useGetGovernanceSummary,
  useGetLiveGovernanceProposals,
} from "./queries";
import { QUERY_KEY } from "../query-keys";

const mockNetwork = { currentNetwork: { chainId: "mainnet" }, isCustomNetwork: false };
const mockRepository = {
  getGovernanceSummary: jest.fn(),
  getGovernanceProposals: jest.fn(),
  getGovernanceMembers: jest.fn(),
  getGovernanceProposal: jest.fn(),
  getGovernanceProposalVotes: jest.fn(),
};
let mockAvailable = true;
jest.mock("@/common/hooks/provider/use-network-provider", () => ({ useNetworkProvider: () => mockNetwork }));
jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiGovernanceRepository: mockAvailable ? mockRepository : null }),
}));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const cleanups: (() => void)[] = [];
const emptyPage = { items: [], page: { hasNext: false, totalCount: 0 } };

beforeEach(() => {
  mockNetwork.isCustomNetwork = false;
  mockNetwork.currentNetwork.chainId = "mainnet";
  mockAvailable = true;
  Object.values(mockRepository).forEach(method => method.mockReset().mockResolvedValue(emptyPage));
});
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()));

async function mount(element: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const container = document.createElement("div");
  const root = createRoot(container);
  const render = () => act(() => root.render(<QueryClientProvider client={client}>{element}</QueryClientProvider>));
  render();
  await act(async () => {
    await delay(0);
    await delay(0);
  });
  cleanups.push(() => {
    act(() => root.unmount());
    client.clear();
  });
  return { client, container, render };
}

function AllQueries() {
  useGetGovernanceSummary();
  useGetGovernanceProposals();
  useGetGovernanceMembers();
  useGetGovernanceProposal("1");
  useGetGovernanceProposalVotes({ id: "1" });
  useGetLiveGovernanceProposals();
  return null;
}

it("makes no governance requests on a custom network even with a repository", async () => {
  mockNetwork.isCustomNetwork = true;
  await mount(<AllQueries />);
  Object.values(mockRepository).forEach(method => expect(method).not.toHaveBeenCalled());
});

it("waits without requesting when the repository is absent", async () => {
  mockAvailable = false;
  await mount(<AllQueries />);
  Object.values(mockRepository).forEach(method => expect(method).not.toHaveBeenCalled());
});

it.each(["mainnet", "testnet"])("requests q and sort on %s with the frontend page size", async chainId => {
  mockNetwork.currentNetwork.chainId = chainId;
  function Probe() {
    useGetGovernanceProposals({ q: "@alice", sort: "status", order: "desc" });
    return null;
  }
  const { client } = await mount(<Probe />);
  const request = { q: "@alice", sort: "status", order: "desc", page: 1, limit: 40 };
  expect(mockRepository.getGovernanceProposals).toHaveBeenCalledWith(request);
  expect(
    client.getQueryData([
      chainId,
      QUERY_KEY.getGovernanceProposals,
      { q: "@alice", sort: "status", order: "desc", page: 1 },
    ]),
  ).toEqual(emptyPage);
});

it("fetches every live page independently of the searched proposal list", async () => {
  mockRepository.getGovernanceProposals.mockImplementation(async params => {
    if (params.q) return emptyPage;
    return { items: [{ id: params.page }], page: { hasNext: params.page < 3, totalCount: 201 } };
  });
  function Probe() {
    useGetGovernanceProposals({ q: "no match" });
    const { data } = useGetLiveGovernanceProposals();
    return <output>{data?.map(proposal => proposal.id).join(",")}</output>;
  }
  const { container } = await mount(<Probe />);
  expect(container.textContent).toBe("1,2,3");
  for (const page of [1, 2, 3]) {
    expect(mockRepository.getGovernanceProposals).toHaveBeenCalledWith({
      status: "ACTIVE",
      sort: "id",
      order: "desc",
      page,
      limit: 100,
    });
  }
});

it("exposes a failed live page as an error rather than a partial successful list", async () => {
  mockRepository.getGovernanceProposals
    .mockResolvedValueOnce({ items: [{ id: 1 }], page: { hasNext: true, totalCount: 2 } })
    .mockRejectedValueOnce(new Error("Next page failed"));
  function Probe() {
    const { data, error } = useGetLiveGovernanceProposals();
    return <output>{error?.message ?? (data ? "success" : "loading")}</output>;
  }
  const { container } = await mount(<Probe />);
  expect(container.textContent).toBe("Next page failed");
});
