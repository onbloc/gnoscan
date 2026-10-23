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
  useServiceProvider: () => ({ apiTransactionRepository: mockRepository }),
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
});
