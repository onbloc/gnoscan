/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setTimeout as delay } from "node:timers/promises";
import { AxiosError, AxiosResponse } from "axios";
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
  useServiceProvider: () => ({
    apiGovernanceRepository: mockAvailable && !mockNetwork.isCustomNetwork ? mockRepository : null,
  }),
}));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const cleanups: (() => void)[] = [];
const emptyPage = { items: [], page: { hasNext: false, totalCount: 0 } };
const httpError = (status: number) =>
  new AxiosError("Request failed", undefined, undefined, undefined, { status } as AxiosResponse);

beforeEach(() => {
  mockNetwork.isCustomNetwork = false;
  mockNetwork.currentNetwork.chainId = "mainnet";
  mockAvailable = true;
  Object.values(mockRepository).forEach(method => method.mockReset().mockResolvedValue(emptyPage));
});
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
  jest.useRealTimers();
});

async function mount(element: React.ReactElement, fakeTimers = false) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const container = document.createElement("div");
  const root = createRoot(container);
  const render = () => act(() => root.render(<QueryClientProvider client={client}>{element}</QueryClientProvider>));
  render();
  await act(async () => {
    if (fakeTimers) {
      await jest.advanceTimersByTimeAsync(10);
    } else {
      await delay(0);
      await delay(0);
    }
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

function ProposalDetail({ options }: { options?: Parameters<typeof useGetGovernanceProposal>[1] }) {
  const { data, error } = useGetGovernanceProposal("1", { retryDelay: 0, ...options });
  return <output>{error?.message ?? (data ? "success" : "loading")}</output>;
}

it.each([400, 404])("immediately exposes HTTP %s without retrying proposal detail", async status => {
  jest.useFakeTimers();
  mockRepository.getGovernanceProposal.mockRejectedValue(httpError(status));
  const { container } = await mount(<ProposalDetail />, true);
  expect(mockRepository.getGovernanceProposal).toHaveBeenCalledTimes(1);
  expect(container.textContent).toBe("Request failed");
});

it.each([
  { kind: "server", error: httpError(500) },
  { kind: "network", error: new Error("Network Error") },
])("retries transient $kind failures three times before exposing the error", async ({ error }) => {
  jest.useFakeTimers();
  mockRepository.getGovernanceProposal.mockRejectedValue(error);
  const { container } = await mount(<ProposalDetail />, true);
  expect(mockRepository.getGovernanceProposal).toHaveBeenCalledTimes(4);
  expect(container.textContent).toBe(error.message);
});

it("returns detail when a transient failure recovers on retry", async () => {
  jest.useFakeTimers();
  mockRepository.getGovernanceProposal.mockRejectedValueOnce(httpError(503)).mockResolvedValueOnce({ id: 1 });
  const { container } = await mount(<ProposalDetail />, true);
  expect(mockRepository.getGovernanceProposal).toHaveBeenCalledTimes(2);
  expect(container.textContent).toBe("success");
});

it("allows the caller to override the detail retry policy", async () => {
  jest.useFakeTimers();
  mockRepository.getGovernanceProposal.mockRejectedValue(httpError(404));
  const { container } = await mount(<ProposalDetail options={{ retry: 1 }} />, true);
  expect(mockRepository.getGovernanceProposal).toHaveBeenCalledTimes(2);
  expect(container.textContent).toBe("Request failed");
});

it("makes no governance requests when the provider disables repositories on a custom network", async () => {
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
    return {
      items: [{ id: 8 - params.page * 2 }, { id: 7 - params.page * 2 }],
      page: { hasNext: params.page < 3, totalCount: 6 },
    };
  });
  function Probe() {
    useGetGovernanceProposals({ q: "no match" });
    const { data } = useGetLiveGovernanceProposals();
    return <output>{data?.map(proposal => proposal.id).join(",")}</output>;
  }
  const { container } = await mount(<Probe />);
  expect(container.textContent).toBe("6,5,4,3,2,1");
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

it.each([
  { name: "empty first page with hasNext", pages: [[], [3]], hasNext: [true, false] },
  { name: "empty intermediate page with hasNext", pages: [[3], [], [2]], hasNext: [true, true, false] },
  {
    name: "repeated page",
    pages: [
      [3, 2],
      [3, 2],
    ],
    hasNext: [true, true],
  },
  {
    name: "overlapping IDs",
    pages: [
      [4, 3],
      [3, 2],
    ],
    hasNext: [true, false],
  },
  { name: "ascending next page", pages: [[2], [3]], hasNext: [true, false] },
  { name: "ascending IDs within a page", pages: [[3, 4]], hasNext: [false] },
  { name: "duplicate IDs within a page", pages: [[3, 3]], hasNext: [false] },
  { name: "negative proposal ID", pages: [[-1]], hasNext: [true] },
  { name: "fractional proposal ID", pages: [[1.5]], hasNext: [true] },
  { name: "unsafe proposal ID", pages: [[Number.MAX_SAFE_INTEGER + 1]], hasNext: [true] },
  { name: "non-finite proposal ID", pages: [[NaN]], hasNext: [true] },
])("rejects contradictory live pagination: $name", async ({ pages, hasNext }) => {
  let requests = 0;
  mockRepository.getGovernanceProposals.mockImplementation(async () => {
    const index = requests++;
    return {
      items: (pages[index] ?? []).map(id => ({ id })),
      page: { hasNext: hasNext[index] ?? false, totalCount: 10 },
    };
  });
  function Probe() {
    const { data, error } = useGetLiveGovernanceProposals();
    return <output>{error?.message ?? (data ? "success" : "loading")}</output>;
  }
  const { container, client } = await mount(<Probe />);
  expect(container.textContent).toMatch(/^Governance pagination /);
  expect(client.getQueryData(["mainnet", QUERY_KEY.getLiveGovernanceProposals])).toBeUndefined();
  expect(mockRepository.getGovernanceProposals).toHaveBeenCalledTimes(
    pages[0].length === 0 || pages.length === 1 ? 1 : 2,
  );
});

it("accepts an empty terminal live page", async () => {
  mockRepository.getGovernanceProposals
    .mockResolvedValueOnce({ items: [{ id: 3 }], page: { hasNext: true, totalCount: 1 } })
    .mockResolvedValueOnce(emptyPage);
  function Probe() {
    const { data } = useGetLiveGovernanceProposals();
    return <output>{data?.map(proposal => proposal.id).join(",")}</output>;
  }
  const { container } = await mount(<Probe />);
  expect(container.textContent).toBe("3");
  expect(mockRepository.getGovernanceProposals).toHaveBeenCalledTimes(2);
});
