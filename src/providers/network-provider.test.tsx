/** @jest-environment jsdom */
import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { MutableSnapshot, RecoilRoot, useRecoilValue } from "recoil";
import { ApolloClient, useApolloClient } from "@apollo/client";
import axios, { AxiosAdapter } from "axios";
import { NextRouter, useRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { setTimeout as delay } from "node:timers/promises";

import { ChainModel } from "@/models/chain-model";
import { NetworkState } from "@/states";
import { NetworkControls, NetworkInfo, useNetwork } from "@/common/hooks/use-network";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { readHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import GovernanceContainer from "@/containers/governance/governance-container/GovernanceContainer";
import { GovernanceProposal, GovernanceSummary } from "@/models/api/governance";
import theme from "@/styles/theme";
import NetworkProvider, { NetworkContextProps } from "./network-provider";

jest.mock("@/common/hooks/provider/use-service-provider", () => {
  const { useMemo } = jest.requireActual("react");
  const { useNetworkProvider } = jest.requireActual("@/common/hooks/provider/use-network-provider");
  const { ApiGovernanceRepositoryImpl } = jest.requireActual(
    "@/repositories/api/governance/api-governance-repository-impl",
  );
  return {
    useServiceProvider: () => {
      const { onblocAPIClient } = useNetworkProvider();
      const repository = useMemo(
        () => (onblocAPIClient ? new ApiGovernanceRepositoryImpl(onblocAPIClient) : null),
        [onblocAPIClient],
      );
      return { apiGovernanceRepository: repository };
    },
  };
});
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));
jest.mock("@/components/view/datatable/item/address-copy", () => ({
  AddressCopy: ({ address }: { address: string }) => <a href={`/account/${address}`}>{address}</a>,
}));
jest.mock("@/assets/svgs/icon-sort-down.svg", () => () => null);
jest.mock("@/assets/svgs/icon-arrow.svg", () => () => null);
jest.mock("@/assets/svgs/icon-sort-up.svg", () => () => null);
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
  title: "Review validator settings",
  type: "VALIDATOR_SET",
  status: "ACTIVE",
  proposer: { address: "g1proposer", nameTag: "alice" },
  votes: {
    yes: { percent: 40, count: 4, power: 4 },
    no: { percent: 10, count: 1, power: 1 },
    abstain: { percent: 0, count: 0, power: 0 },
  },
};
const summary: GovernanceSummary = {
  syncedAt: null,
  proposals: { total: 200, active: 1, accepted: 190, rejected: 9 },
  members: { total: 200, totalPower: 100, tiers: [] },
};

const chains: ChainModel[] = ["A", "B"].map(chainId => ({
  name: `Chain ${chainId}`,
  chainId,
  apiUrl: `https://api.${chainId.toLowerCase()}.test`,
  rpcUrl: `https://rpc.${chainId.toLowerCase()}.test`,
  fallbackRpcUrl: `https://fallback.${chainId.toLowerCase()}.test`,
  indexerUrl: `https://indexer.${chainId.toLowerCase()}.test`,
  gnoWebUrl: `https://web.${chainId.toLowerCase()}.test`,
}));
const originalDefault = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID;
const originalAdapter = axios.defaults.adapter;
const originalFetch = globalThis.fetch;
const HISTORY_NAME = "governance:list";
let latest: {
  network: NetworkControls;
  context: NetworkContextProps;
  atom: NetworkInfo | null;
  apollo: ApolloClient<object>;
};
let root: Root | null;
let queryClient: QueryClient | null;
let container: HTMLDivElement;
let selections: { uri: string; network: string | null; hookNetwork: string | null }[];
let requests: { uri: string; baseURL: string | undefined; path: string }[];

function Consumer({ governance }: { governance: boolean }) {
  const router = useRouter();
  const network = useNetwork();
  const context = useNetworkProvider();
  const atom = useRecoilValue(NetworkState.currentNetwork);
  const apollo = useApolloClient();
  React.useLayoutEffect(() => {
    latest = { network, context, atom, apollo };
    selections.push({
      uri: router.asPath,
      network: context.currentNetwork?.chainId ?? null,
      hookNetwork: network.currentNetwork?.chainId ?? null,
    });
  });
  React.useEffect(() => {
    if (context.onblocAPIClient) void context.onblocAPIClient.get({ url: "/governance/proposals" });
  }, [context.onblocAPIClient]);
  return (
    <main data-layout>
      <output data-current-network>{context.currentNetwork?.name || "Loading network"}</output>
      <a data-network-link href={network.getUrlWithNetwork("/governance/20?q=halt#overview")}>
        Proposal
      </a>
      {governance && router.pathname === "/governance" && <GovernanceContainer />}
    </main>
  );
}

function unmount() {
  if (root) act(() => root?.unmount());
  root = null;
  queryClient?.clear();
  queryClient = null;
  container?.remove();
}

function mount({
  uri = "/governance?chainId=A",
  ready = true,
  networks = chains,
  seed,
  governance = false,
}: { uri?: string; ready?: boolean; networks?: ChainModel[]; seed?: NetworkInfo; governance?: boolean } = {}) {
  unmount();
  window.history.replaceState({ key: "list-A" }, "", uri);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: Infinity, staleTime: Infinity } },
  });
  let pendingReplacement: { uri: string; resolve: (value: boolean) => void } | undefined;
  const replace = jest.fn((uri: string) => {
    const replacement = Promise.withResolvers<boolean>();
    pendingReplacement = { uri, resolve: replacement.resolve };
    return replacement.promise;
  });
  const push = jest.fn(async (nextUri: string) => {
    visit(nextUri);
    return true;
  });
  let router: NextRouter = {
    basePath: "",
    pathname: "",
    route: "",
    query: {},
    asPath: "",
    isReady: ready,
    isFallback: false,
    isPreview: false,
    isLocaleDomain: false,
    push,
    replace,
    reload: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(async () => undefined),
    beforePopState: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  };
  const initializeState = ({ set }: MutableSnapshot) => {
    if (seed) set(NetworkState.currentNetwork, seed);
  };
  function render() {
    const url = new URL(window.location.href);
    const query: NextRouter["query"] = {};
    url.searchParams.forEach((value, key) => (query[key] = value));
    router = {
      ...router,
      query,
      pathname: url.pathname,
      route: url.pathname,
      asPath: url.pathname + url.search + url.hash,
    };
    root!.render(
      <RouterContext.Provider value={router}>
        <QueryClientProvider client={queryClient!}>
          <RecoilRoot initializeState={initializeState}>
            <NetworkProvider chains={networks}>
              <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
                <Consumer governance={governance} />
              </ThemeProvider>
            </NetworkProvider>
          </RecoilRoot>
        </QueryClientProvider>
      </RouterContext.Provider>,
    );
  }
  function visit(nextUri: string, key = "detail") {
    act(() => {
      window.history.pushState({ key }, "", nextUri);
      render();
    });
  }
  act(render);
  return {
    replace,
    visit,
    setReady(value: boolean) {
      act(() => {
        router = { ...router, isReady: value };
        render();
      });
    },
    setNetworks(value: ChainModel[]) {
      act(() => {
        networks = value;
        render();
      });
    },
    async commitReplace() {
      if (!pendingReplacement) throw new Error("No pending router replacement");
      const { uri, resolve } = pendingReplacement;
      pendingReplacement = undefined;
      await act(async () => {
        window.history.replaceState(window.history.state, "", uri);
        render();
        resolve(true);
      });
    },
    async traverse(delta: number) {
      await act(async () => {
        const popped = Promise.withResolvers<void>();
        window.addEventListener(
          "popstate",
          () => {
            render();
            popped.resolve();
          },
          { once: true },
        );
        window.history.go(delta);
        await popped.promise;
      });
    },
  };
}

async function waitFor(predicate: () => boolean) {
  for (let attempt = 0; attempt < 100; attempt++) {
    await act(async () => {
      await delay(10);
    });
    if (predicate()) return;
  }
  expect(predicate()).toBe(true);
}

function click(selector: string) {
  act(() => container.querySelector<HTMLElement>(selector)!.click());
}

async function configureList(tab: string) {
  await waitFor(() => !!container.querySelector("button[aria-label='Sort by ID']"));
  click("button[aria-label='Sort by ID']");
  const input = container.querySelector<HTMLInputElement>("input[type=search]")!;
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "halt");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await waitFor(() =>
    requests.some(request => new URL(request.path, window.location.origin).searchParams.get("q") === "halt"),
  );
  if (tab === "members") {
    const button = Array.from(container.querySelectorAll("button")).find(item =>
      item.textContent?.startsWith("Members"),
    )!;
    act(() => button.click());
    await waitFor(() => !!container.querySelector("button[aria-label='Sort by Voting Power']"));
    click("button[aria-label='Sort by Voting Power']");
  }
  await waitFor(() => !!container.querySelector("button[aria-label='Next page']"));
  click("button[aria-label='Next page']");
  click("button[aria-label='Next page']");
  await waitFor(() => container.textContent?.includes("Page 3 of 5") === true);
}

beforeAll(() => Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true }));
beforeEach(() => {
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID = "B";
  window.sessionStorage.clear();
  selections = [];
  requests = [];
  const adapter: AxiosAdapter = async config => {
    requests.push({
      uri: window.location.pathname + window.location.search,
      baseURL: config.baseURL,
      path: config.url || "",
    });
    const url = new URL(config.url || "", config.baseURL);
    const data = url.pathname.endsWith("/summary")
      ? summary
      : url.pathname.endsWith("/members")
      ? { items: [], page: { totalCount: 200, hasNext: true } }
      : { items: [proposal], page: { totalCount: 200, hasNext: url.searchParams.get("status") !== "ACTIVE" } };
    return { data: { data }, status: 200, statusText: "OK", headers: {}, config };
  };
  axios.defaults.adapter = adapter;
  globalThis.fetch = jest.fn() as typeof fetch;
});
afterEach(() => {
  unmount();
  axios.defaults.adapter = originalAdapter;
  globalThis.fetch = originalFetch;
  if (originalDefault === undefined) delete process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID;
  else process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID = originalDefault;
  jest.restoreAllMocks();
});

it.each([
  ["explicit", "/governance?chainId=A", "A"],
  ["default", "/governance", "B"],
  ["invalid", "/governance?chainId=missing", "B"],
])("resolves %s selection only after the router is ready", async (_label, uri, expected) => {
  const warning = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  const seed = {
    ...chains[0],
    isCustom: false,
    apiUrl: chains[0].apiUrl!,
    rpcUrl: chains[0].rpcUrl!,
    indexerUrl: chains[0].indexerUrl!,
    gnoWebUrl: null,
  };
  const navigation = mount({ uri, ready: false, seed, governance: true });
  expect(container.querySelector("[data-layout]")).not.toBeNull();
  expect(container.querySelector("[data-current-network]")?.textContent).toBe("Loading network");
  expect(container.querySelector("input[type=search]")).toBeNull();
  expect(latest.network.currentNetwork).toBeNull();
  expect(latest.context).toMatchObject({
    currentNetwork: null,
    nodeRPCClient: null,
    mainNodeRPCClient: null,
    indexerQueryClient: null,
    onblocAPIClient: null,
    onblocRPCClient: null,
  });
  expect(requests).toEqual([]);
  expect(window.sessionStorage.length).toBe(0);

  navigation.setReady(true);
  expect(latest.context.currentNetwork?.chainId).toBe(expected);
  expect(latest.network.currentNetwork?.chainId).toBe(expected);
  expect(selections.every(item => item.network === null || item.network === expected)).toBe(true);
  await waitFor(() => !!container.querySelector("button[aria-label='Sort by ID']"));
  expect(requests.every(item => item.baseURL === chains.find(chain => chain.chainId === expected)!.apiUrl)).toBe(true);
  if (uri.includes("missing")) {
    expect(warning).toHaveBeenCalledWith("Invalid ChainId: missing, using default chain: B");
  }
});

it("initializes custom endpoints before considering chainId or a configured fallback", () => {
  const rpc = "https://custom.test/rpc?token=a&path=%2F";
  const indexer = "https://custom.test/indexer?token=b";
  const uri = `/governance?type=custom&chainId=A&rpcUrl=${encodeURIComponent(
    encodeURIComponent(rpc),
  )}&indexerUrl=${encodeURIComponent(indexer)}`;
  const navigation = mount({ uri, ready: false });
  expect(latest.context.currentNetwork).toBeNull();
  expect(requests).toEqual([]);
  navigation.setReady(true);
  expect(latest.context.currentNetwork).toMatchObject({
    name: "Custom Network",
    chainId: "",
    apiUrl: null,
    rpcUrl: rpc,
    fallbackRpcUrl: null,
    indexerUrl: indexer,
  });
  expect(latest.network.currentNetwork?.isCustom).toBe(true);
  expect(latest.context.nodeRPCClient).not.toBeNull();
  expect(latest.context.indexerQueryClient).not.toBeNull();
  expect(latest.context.onblocAPIClient).toBeNull();
  expect(requests).toEqual([]);
});

it.each(["proposals", "members"])("restores A's %s history after detail replace B, Back, and Forward", async tab => {
  const navigation = mount({ governance: true });
  await configureList(tab);
  const state = readHistoryEntryState(HISTORY_NAME, null, "list-A");
  const pageName = `governance-${tab}:A:page`;
  const page = readHistoryEntryState(pageName, null, "list-A");
  expect(state).toMatchObject({ network: "A", tab, searchValue: "halt", keyword: "halt" });
  expect(page).toMatchObject({ page: 3 });
  const detailUrl = latest.network.getUrlWithNetwork("/governance/20#overview");
  navigation.visit(detailUrl);
  const prior = latest;
  act(() => latest.network.changeNetwork("B"));
  expect(latest.atom).toBe(prior.atom);
  expect(latest.context.currentNetwork).toBe(prior.context.currentNetwork);
  expect(window.location.search).toContain("chainId=A");
  expect(navigation.replace).toHaveBeenLastCalledWith("/governance/20?chainId=B#overview");
  await navigation.commitReplace();
  expect(latest.network.currentNetwork?.chainId).toBe("B");
  expect(window.history.state.key).toBe("detail");

  selections = [];
  requests = [];
  const writes = jest.spyOn(Storage.prototype, "setItem");
  await navigation.traverse(-1);
  await waitFor(() => container.textContent?.includes("Page 3 of 5") === true);
  expect(window.history.state.key).toBe("list-A");
  expect(latest.context.currentNetwork?.chainId).toBe("A");
  expect(readHistoryEntryState(HISTORY_NAME, null, "list-A")).toEqual(state);
  expect(readHistoryEntryState(pageName, null, "list-A")).toEqual(page);
  expect(selections.every(item => item.network === null || item.network === "A")).toBe(true);
  expect(selections.every(item => item.hookNetwork === null || item.hookNetwork === "A")).toBe(true);
  expect(requests.every(item => item.baseURL === chains[0].apiUrl)).toBe(true);
  expect(writes.mock.calls.some(([key, value]) => key.includes("list-A") && value.includes('"network":"B"'))).toBe(
    false,
  );
  if (tab === "proposals") {
    expect(container.querySelector<HTMLInputElement>("input[type=search]")?.value).toBe("halt");
    expect(container.querySelector("th[aria-sort=descending]")?.textContent).toContain("ID");
  } else {
    expect(container.querySelector("th[aria-sort=descending]")?.textContent).toContain("Power");
  }

  await navigation.traverse(1);
  expect(latest.context.currentNetwork?.chainId).toBe("B");
  expect(readHistoryEntryState(HISTORY_NAME, null, "list-A")).toEqual(state);
  expect(readHistoryEntryState(pageName, null, "list-A")).toEqual(page);
});

it("keeps A's actual list history when switching detail to custom and navigating Back", async () => {
  const navigation = mount({ governance: true });
  await configureList("members");
  const state = readHistoryEntryState(HISTORY_NAME, null, "list-A");
  const page = readHistoryEntryState("governance-members:A:page", null, "list-A");
  navigation.visit(latest.network.getUrlWithNetwork("/governance/20?q=halt#overview"));
  const atom = latest.atom;
  let switching!: Promise<void>;
  act(() => {
    switching = latest.network.changeCustomNetwork(
      "https://custom.test/rpc?token=a&b=c",
      "https://custom.test/indexer",
    );
  });
  expect(latest.atom).toBe(atom);
  const destination = new URL(navigation.replace.mock.calls[0][0], window.location.origin);
  expect(destination.searchParams.get("q")).toBe("halt");
  expect(destination.searchParams.get("chainId")).toBeNull();
  expect(destination.searchParams.get("rpcUrl")).toBe("https://custom.test/rpc?token=a&b=c");
  expect(destination.hash).toBe("#overview");
  await navigation.commitReplace();
  await switching;
  expect(latest.context.isCustomNetwork).toBe(true);
  await navigation.traverse(-1);
  await waitFor(() => container.textContent?.includes("Page 3 of 5") === true);
  expect(latest.network.currentNetwork?.chainId).toBe("A");
  expect(readHistoryEntryState(HISTORY_NAME, null, "list-A")).toEqual(state);
  expect(readHistoryEntryState("governance-members:A:page", null, "list-A")).toEqual(page);
});

it("reopens real proposal links as A when the configured default is B", async () => {
  mount({ governance: true });
  await waitFor(
    () =>
      !!container.querySelector("table[aria-label='Governance proposals'] a[href^='/governance/20']") &&
      !!container.querySelector("[aria-label='Live proposals'] a[href^='/governance/20']"),
  );
  const tableLink = container.querySelector<HTMLAnchorElement>(
    "table[aria-label='Governance proposals'] a[href^='/governance/20']",
  )!;
  const liveLink = container.querySelector<HTMLAnchorElement>(
    "[aria-label='Live proposals'] a[href^='/governance/20']",
  )!;
  expect(new URL(tableLink.href).searchParams.get("chainId")).toBe("A");
  expect(new URL(liveLink.href).searchParams.get("chainId")).toBe("A");
  const href = tableLink.getAttribute("href")!;
  mount({ uri: href });
  expect(latest.context.currentNetwork).toBe(chains[0]);
  expect(latest.network.currentNetwork?.chainId).toBe("A");
});

it("omits a nonfirst configured default and reopens it as that same network", () => {
  mount({ uri: "/governance?chainId=B" });
  const href = latest.network.getUrlWithNetwork("/governance/20?q=halt#overview");
  const destination = new URL(href, window.location.origin);
  expect(destination.searchParams.has("chainId")).toBe(false);
  expect(destination.searchParams.get("q")).toBe("halt");
  expect(destination.hash).toBe("#overview");
  mount({ uri: href });
  expect(latest.context.currentNetwork).toBe(chains[1]);
  expect(latest.network.currentNetwork?.chainId).toBe("B");
});

it("preserves existing query values, repeated keys, and hash while replacing network parameters", () => {
  mount();
  const destination = new URL(
    latest.network.getUrlWithNetwork(
      "/governance/20?q=halt%20%26%20resume&tag=a&tag=b&empty=&type=custom&rpcUrl=old#overview",
    ),
    window.location.origin,
  );
  expect(destination.searchParams.get("chainId")).toBe("A");
  expect(destination.searchParams.get("q")).toBe("halt & resume");
  expect(destination.searchParams.getAll("tag")).toEqual(["a", "b"]);
  expect(destination.searchParams.get("empty")).toBe("");
  expect(destination.searchParams.has("type")).toBe(false);
  expect(destination.searchParams.has("rpcUrl")).toBe(false);
  expect(destination.hash).toBe("#overview");
});

it("keeps external proposal links on their original origin", () => {
  mount();
  const href = "https://gno.land/r/gov/dao?proposal=20#votes";
  expect(latest.network.getUrlWithNetwork(href)).toBe(href);
});

it("retains model and clients across ID/query navigation and updates changed configured endpoints", () => {
  const staging = { ...chains[0], chainId: "staging", name: "Staging" };
  const networks = [...chains, staging];
  const navigation = mount({ networks });
  const before = latest;
  navigation.visit("/governance/21?chainId=A&q=another#overview");
  expect(latest.atom).toBe(before.atom);
  expect(latest.context.currentNetwork).toBe(before.context.currentNetwork);
  expect(latest.context.nodeRPCClient).toBe(before.context.nodeRPCClient);
  expect(latest.context.indexerQueryClient).toBe(before.context.indexerQueryClient);
  expect(latest.context.onblocAPIClient).toBe(before.context.onblocAPIClient);
  expect(latest.context.mainNodeRPCClient).toBe(before.context.mainNodeRPCClient);
  expect(latest.apollo).toBe(before.apollo);

  const changed = {
    ...chains[0],
    rpcUrl: "https://new-rpc.test",
    indexerUrl: "https://new-indexer.test",
    apiUrl: "https://new-api.test",
  };
  selections = [];
  navigation.setNetworks([changed, chains[1], staging]);
  expect(selections[0].network).toBeNull();
  expect(latest.context.currentNetwork).toBe(changed);
  expect(latest.atom?.rpcUrl).toBe(changed.rpcUrl);
  expect(latest.context.nodeRPCClient).not.toBe(before.context.nodeRPCClient);
  expect(latest.context.indexerQueryClient).not.toBe(before.context.indexerQueryClient);
  expect(latest.context.onblocAPIClient).not.toBe(before.context.onblocAPIClient);
  expect(latest.apollo).not.toBe(before.apollo);

  const beforeFallback = latest.context.nodeRPCClient;
  navigation.setNetworks([{ ...changed, fallbackRpcUrl: "https://new-fallback.test" }, chains[1], staging]);
  expect(latest.context.nodeRPCClient).not.toBe(beforeFallback);
});

it("keeps custom clients on unrelated navigation and replaces them when endpoint selection changes", () => {
  const uri =
    "/governance/20?type=custom&rpcUrl=https%3A%2F%2Fcustom.test%2Frpc&indexerUrl=https%3A%2F%2Fcustom.test%2Findexer";
  const navigation = mount({ uri });
  const before = latest;
  navigation.visit(`${uri.replace("/20", "/21")}&chainId=B&q=halt#overview`);
  expect(latest.atom).toBe(before.atom);
  expect(latest.context.currentNetwork).toBe(before.context.currentNetwork);
  expect(latest.context.nodeRPCClient).toBe(before.context.nodeRPCClient);
  expect(latest.context.indexerQueryClient).toBe(before.context.indexerQueryClient);
  expect(latest.apollo).toBe(before.apollo);

  navigation.visit(uri.replace("custom.test", "changed.test"));
  expect(latest.context.currentNetwork?.rpcUrl).toBe("https://changed.test/rpc");
  expect(latest.context.nodeRPCClient).not.toBe(before.context.nodeRPCClient);
  expect(latest.context.indexerQueryClient).not.toBe(before.context.indexerQueryClient);
  expect(latest.apollo).not.toBe(before.apollo);
});

it("retains RPC-only clients on query navigation and updates them for a changed RPC endpoint", () => {
  const uri = "/governance/20?type=custom&rpcUrl=https%3A%2F%2Fcustom.test%2Frpc";
  const navigation = mount({ uri });
  const before = latest;
  expect(before.context.onblocRPCClient).not.toBeNull();
  expect(before.context.indexerQueryClient).toBeNull();
  navigation.visit(`${uri.replace("/20", "/21")}&q=halt#overview`);
  expect(latest.context.nodeRPCClient).toBe(before.context.nodeRPCClient);
  expect(latest.context.onblocRPCClient).toBe(before.context.onblocRPCClient);
  expect(latest.apollo).toBe(before.apollo);
  navigation.visit(uri.replace("custom.test", "changed.test"));
  expect(latest.context.nodeRPCClient).not.toBe(before.context.nodeRPCClient);
  expect(latest.context.onblocRPCClient).not.toBe(before.context.onblocRPCClient);
});
