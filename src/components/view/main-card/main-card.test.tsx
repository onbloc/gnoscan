import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import { AxiosError } from "axios";
import theme from "@/styles/theme";
import { FetchedComp } from "./main-card";
import { StandardNetworkSupplyCard } from "./cards/supply/StandardNetworkSupplyCard";

jest.mock("@/assets/svgs/icon-link.svg", () => "svg");
jest.mock("@/components/ui/tooltip/info-tooltip", () => ({ InfoTooltip: () => null }));
// main-card.tsx imports every card; only the supply card is under test and the rest pull in the whole app.
jest.mock("./cards/supply/CustomNetworkSupplyCard", () => ({ CustomNetworkSupplyCard: () => null }));
jest.mock("./cards/block/CustomNetworkBlockCard", () => ({ CustomNetworkBlockCard: () => null }));
jest.mock("./cards/block/StandardNetworkBlockCard", () => ({ StandardNetworkBlockCard: () => null }));
jest.mock("./cards/transaction/CustomNetworkTransactionsCard", () => ({ CustomNetworkTxsCard: () => null }));
jest.mock("./cards/transaction/StandardNetworkTransactionsCard", () => ({ StandardNetworkTxsCard: () => null }));
jest.mock("./cards/deposit/StorageDepositCard", () => ({ StorageDepositCard: () => null }));
jest.mock("./cards/account/CustomNetworkAccountCard", () => ({ CustomNetworkAccountCard: () => null }));

const mockQueries = { supply: {} as unknown, market: {} as unknown };

jest.mock("@/common/react-query/statistics", () => ({
  useGetSummarySupply: () => mockQueries.supply,
  useGetGnotPrice: () => mockQueries.market,
}));

const loading = { data: undefined, isFetched: false, isError: false, error: null, errorUpdatedAt: 0 };
const failed = (status: number) => ({
  data: undefined,
  isFetched: true,
  isError: true,
  error: new AxiosError("failed", "ERR_BAD_RESPONSE", undefined, undefined, { status } as never),
  errorUpdatedAt: 1,
});

const market = {
  ...loading,
  isFetched: true,
  data: { data: { price: "1.234", changeRateOneDay: null, circulatingSupply: "1000", status: "ok" } },
};

const render = (node: React.ReactElement) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      {node}
    </ThemeProvider>,
  );

describe("FetchedComp", () => {
  const value = <span>VALUE</span>;

  it("shows a dash instead of the value when the statistic is unavailable, even if it was fetched", () => {
    const html = render(<FetchedComp skeletonWidth={60} isFetched isError renderComp={value} />);

    expect(html).toContain(">-<");
    expect(html).not.toContain("VALUE");
  });

  it("shows the value once fetched without an error", () => {
    expect(render(<FetchedComp skeletonWidth={60} isFetched renderComp={value} />)).toContain("VALUE");
  });

  it("shows neither the value nor a dash while loading", () => {
    const html = render(<FetchedComp skeletonWidth={60} isFetched={false} renderComp={value} />);

    expect(html).not.toContain("VALUE");
    expect(html).not.toContain(">-<");
  });
});

describe("StandardNetworkSupplyCard", () => {
  it("reports one notice and keeps the field that still has data when only one endpoint fails", () => {
    mockQueries.market = market;
    mockQueries.supply = failed(500);

    const html = render(<StandardNetworkSupplyCard />);

    expect(html).toContain("$1.2340");
    expect(html).toContain("Statistics could not be loaded.");
    expect(html.match(/role="status"/g)).toHaveLength(1);
  });

  it("dashes every field and tells a 404 apart when both endpoints are unavailable", () => {
    mockQueries.market = failed(404);
    mockQueries.supply = failed(500);

    const html = render(<StandardNetworkSupplyCard />);

    expect(html).not.toContain("$");
    expect(html).not.toContain("GNOT");
    expect(html).toContain("Statistics are not available yet.");
  });

  it("shows no notice while the statistics are still loading", () => {
    mockQueries.market = loading;
    mockQueries.supply = loading;

    expect(render(<StandardNetworkSupplyCard />)).not.toContain("Statistics");
  });
});
