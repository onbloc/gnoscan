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

type ChartProps = React.ComponentProps<typeof RealmShareChart>;

const series = { realm: [{ value: 1, rate: 100 }] };
const queryState = { data: undefined, error: null, isError: false };
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
  it("draws the chart as before when no query is attached", () => {
    expect(render({})).toContain("CHART");
  });

  it("shows the unavailable notice instead of a spinner or chart on a 404, keeping the period controls", () => {
    const html = render({
      isFetched: false,
      datas: {},
      failure: { ...queryState, error: httpError(404), isError: true },
    });

    expect(html).toContain("Statistics are not available yet.");
    expect(html).toContain("30D");
    expect(html).not.toContain("SPINNER");
    expect(html).not.toContain("CHART");
  });

  it("keeps the chart without a notice when a refresh fails", () => {
    const html = render({ failure: { ...queryState, data: {}, error: httpError(500) } });

    expect(html).not.toContain("alert");
    expect(html).toContain("CHART");
  });

  it("keeps the spinner while a query has not produced data and has not failed", () => {
    expect(render({ isFetched: false, datas: {}, failure: queryState })).toContain("SPINNER");
  });
});
