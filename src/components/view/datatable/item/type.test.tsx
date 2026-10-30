/** @jest-environment jsdom */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { setTimeout as delay } from "node:timers/promises";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { Type } from "./type";

const mockRepository = { getTransactionContracts: jest.fn() };
jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiTransactionRepository: mockRepository, blockRepository: {} }),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "test-chain" } }),
}));
jest.mock("@/common/hooks/use-network", () => ({ useNetwork: () => ({ getUrlWithNetwork: (url: string) => url }) }));
jest.mock(
  "next/link",
  () =>
    ({ children }: { children: React.ReactNode }) =>
      children,
);
jest.mock(
  "@/components/ui/tooltip",
  () =>
    ({ children }: { children: React.ReactNode }) =>
      children,
);

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

// gno-token-resource lists by type, served for the "test-chain" network.
const tokenResourceLists: Record<string, unknown[]> = {};
Object.assign(globalThis, {
  fetch: async (url: string) => {
    const type = url.split("/").slice(-2)[0];
    return { ok: true, json: async () => tokenResourceLists[type] ?? [] };
  },
});

const run = (packagePath: string) => ({
  messageType: "/vm.m_run",
  calledFunctions: [{ packagePath, method: "Do" }],
});

describe("Type", () => {
  test("a run label counts the realms called on every contracts page", async () => {
    mockRepository.getTransactionContracts
      .mockResolvedValueOnce({ items: [run("gno.land/r/demo/a")], page: { hasNext: true, cursor: "next" } })
      .mockResolvedValueOnce({ items: [run("gno.land/r/demo/b")], page: { hasNext: false, cursor: "" } });

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
            <Type messageType="/vm.m_run" functionName="MsgRun" txHash="hash" />
          </ThemeProvider>
        </QueryClientProvider>,
      ),
    );
    for (let i = 0; i < 10 && mockRepository.getTransactionContracts.mock.calls.length < 2; i++) {
      await act(() => delay(10));
    }
    await act(() => delay(10));

    expect(mockRepository.getTransactionContracts).toHaveBeenCalledTimes(2);
    expect(container.textContent).toContain("run ·r/demo/a+1");

    act(() => root.unmount());
    client.clear();
  });

  test("a dApp from gno-token-resource without a website shows its logo without a link", async () => {
    tokenResourceLists.grc20 = [
      { pkg_path: "gno.land/r/nosite/token", name: "No site", image: "/a.svg", website_url: "" },
    ];

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
            <Type messageType="/vm.m_call" functionName="Swap" packagePath="gno.land/r/nosite/router" />
          </ThemeProvider>
        </QueryClientProvider>,
      ),
    );
    await act(() => delay(10));

    expect(container.querySelector("img.dapp-logo")?.getAttribute("alt")).toBe("No site");
    expect(container.querySelector("a.dapp-link")).toBeNull();

    act(() => root.unmount());
    client.clear();
    delete tokenResourceLists.grc20;
  });

  test("a logo that failed to load does not hide the gno-token-resource logo that replaces it", async () => {
    tokenResourceLists.grc20 = [
      {
        pkg_path: "gno.land/r/akkadia/abt",
        name: "Akkadia",
        image: "/akkadia.svg",
        website_url: "https://akkadia.land",
      },
    ];

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
            <Type messageType="/vm.m_call" functionName="Mint" packagePath="gno.land/r/akkadia/abt" />
          </ThemeProvider>
        </QueryClientProvider>,
      ),
    );
    // The dapps.json logo shows until the lists load.
    act(() => {
      container.querySelector("img.dapp-logo")?.dispatchEvent(new Event("error"));
    });
    await act(() => delay(10));

    expect(container.querySelector("img.dapp-logo")?.getAttribute("src")).toMatch(/gno-token-resource.*akkadia\.svg$/);

    act(() => root.unmount());
    client.clear();
    delete tokenResourceLists.grc20;
  });

  test("a run label fetches nothing until its row is on screen", async () => {
    mockRepository.getTransactionContracts.mockReset();
    mockRepository.getTransactionContracts.mockResolvedValue({
      items: [run("gno.land/r/demo/a")],
      page: { hasNext: false, cursor: "" },
    });
    let reportVisible: (entries: { isIntersecting: boolean }[]) => void = () => undefined;
    Object.assign(globalThis, {
      IntersectionObserver: class {
        constructor(callback: typeof reportVisible) {
          reportVisible = callback;
        }
        observe() {}
        disconnect() {}
      },
    });

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
            <Type messageType="/vm.m_run" functionName="MsgRun" txHash="hash" />
          </ThemeProvider>
        </QueryClientProvider>,
      ),
    );
    await act(() => delay(10));
    expect(mockRepository.getTransactionContracts).not.toHaveBeenCalled();

    act(() => reportVisible([{ isIntersecting: true }]));
    await act(() => delay(10));
    expect(mockRepository.getTransactionContracts).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain("run ·r/demo/a");

    act(() => root.unmount());
    client.clear();
    delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
  });
});
