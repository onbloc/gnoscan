/** @jest-environment jsdom */
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { AxiosError } from "axios";
import { setTimeout as delay } from "node:timers/promises";
import theme from "@/styles/theme";
import MainTransactionNews from "./main-transaction-news";

// React reads this flag from the global scope, whose type does not declare it.
const reactGlobal = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
reactGlobal.IS_REACT_ACT_ENVIRONMENT = true;

const mockRepository = { getTotalDailyStorageDeposit: jest.fn() };
const mockChainRepository = { getStoragePrice: jest.fn() };
const mockNetwork = { isCustomNetwork: false };

jest.mock("@/common/hooks/provider/use-service-provider", () => ({
  useServiceProvider: () => ({ apiStatisticsRepository: mockRepository, chainRepository: mockChainRepository }),
}));
jest.mock("@/common/hooks/provider/use-network-provider", () => ({
  useNetworkProvider: () => ({ currentNetwork: { chainId: "chain-a" }, isCustomNetwork: mockNetwork.isCustomNetwork }),
}));
jest.mock("@/common/hooks/common/use-token-meta", () => ({
  GNOTToken: { denom: "ugnot", symbol: "GNOT", name: "Gno.land", decimals: 6 },
}));
// The charts and the other cards are out of scope; only the storage deposit card is exercised.
jest.mock("@/components/ui/chart/stacked-bar-chart/stacked-bar-chart2", () => ({
  StackedBarChart2: () => <span>STORAGE_CHART</span>,
}));
jest.mock("./index", () => ({ MainTotalTransaction: () => null, MainTotalDailyFee: () => null }));
jest.mock("./total-transaction/total-transaction-api", () => ({ MainTotalTransactionApi: () => null }));
jest.mock("./total-daily-fee/total-daily-fee-api", () => ({ MainTotalDailyFeeApi: () => null }));

describe("MainTransactionNews total storage deposit", () => {
  let container: HTMLDivElement;
  let root: Root;
  let client: QueryClient;

  const mount = async () => {
    act(() => {
      root.render(
        <QueryClientProvider client={client}>
          <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
            <MainTransactionNews />
          </ThemeProvider>
        </QueryClientProvider>,
      );
    });
    await act(async () => {
      await delay(0);
      await delay(0);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement("div");
    root = createRoot(container);
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    mockChainRepository.getStoragePrice.mockResolvedValue(null);
  });

  afterEach(() => {
    act(() => root.unmount());
    client.clear();
    container.remove();
  });

  it("does not request the statistic on a custom network, which does not serve it", async () => {
    mockNetwork.isCustomNetwork = true;

    await mount();

    expect(mockRepository.getTotalDailyStorageDeposit).not.toHaveBeenCalled();
    expect(container.textContent).not.toContain("Statistics");
  });

  it("replaces the chart with the notice when a standard network has not produced it yet", async () => {
    mockNetwork.isCustomNetwork = false;
    mockRepository.getTotalDailyStorageDeposit.mockRejectedValue(
      new AxiosError("failed", "ERR_BAD_RESPONSE", undefined, undefined, { status: 404 } as never),
    );

    await mount();

    expect(container.textContent).toContain("Statistics are not available yet.");
    expect(container.textContent).not.toContain("STORAGE_CHART");
  });
});
