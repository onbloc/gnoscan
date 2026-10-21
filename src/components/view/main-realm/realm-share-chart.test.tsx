import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ThemeProvider } from "styled-components";
import { AxiosError } from "axios";
import theme from "@/styles/theme";
import { RealmShareChart } from "./realm-share-chart";

jest.mock("next/dynamic", () => () => {
  const MockChart = () => <span>CHART</span>;
  return MockChart;
});
jest.mock("@/components/ui/loading", () => {
  const MockSpinner = () => <span>SPINNER</span>;
  return { Spinner: MockSpinner };
});
// The real button barrel pulls in SVG assets that jest cannot load.
jest.mock("@/components/ui/button", () => {
  const MockButton = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
    <button className={className}>{children}</button>
  );
  return { Button: MockButton };
});

type ChartProps = React.ComponentProps<typeof RealmShareChart>;

const series = { realm: [{ value: 1, rate: 100 }] };
const queryState = { data: undefined, error: null, isError: false, isFetching: false, refetch: jest.fn() };
const httpError = (status: number) =>
  new AxiosError("failed", "ERR_BAD_RESPONSE", undefined, undefined, { status } as never);

const render = (props: Partial<ChartProps>) =>
  renderToStaticMarkup(
    <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
      <RealmShareChart
        title="Share"
        period={7}
        onChangePeriod={jest.fn()}
        isFetched
        labels={[]}
        datas={series}
        {...props}
      />
    </ThemeProvider>,
  );

describe("RealmShareChart", () => {
  it("draws the chart as before when no query is attached, even without data", () => {
    expect(render({})).toContain("CHART");

    const empty = render({ datas: {} });
    expect(empty).toContain("CHART");
    expect(empty).not.toContain("No statistics");
  });

  it("shows the unavailable notice instead of a spinner or chart on a 404, keeping the period controls", () => {
    const html = render({
      isFetched: false,
      datas: {},
      query: { ...queryState, error: httpError(404), isError: true },
    });

    expect(html).toContain("Statistics are not available yet.");
    expect(html).toContain("30D");
    expect(html).not.toContain("SPINNER");
    expect(html).not.toContain("CHART");
  });

  it("keeps the chart next to a refresh failure notice", () => {
    const html = render({ query: { ...queryState, data: {}, error: httpError(500), isError: true } });

    expect(html).toContain("Refresh failed. Showing previously loaded data.");
    expect(html).toContain("CHART");
  });

  it("distinguishes an empty result from a loading chart", () => {
    const loaded = { ...queryState, data: {} };

    expect(render({ datas: {}, query: loaded })).toContain("No statistics for this period.");
    expect(render({ query: loaded })).toContain("CHART");
    expect(render({ isFetched: false, datas: {}, query: queryState })).toContain("SPINNER");
  });
});
