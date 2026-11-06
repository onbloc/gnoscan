/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import theme from "@/styles/theme";
import { BalanceChart } from "./balance-chart";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "themeState", default: "light" }) };
});

let chartProps: any;
jest.mock(
  "react-chartjs-2",
  () => {
    const { Component } = jest.requireActual("react");
    return {
      Line: class Line extends Component<any> {
        render() {
          chartProps = this.props;
          return null;
        }
      },
    };
  },
  // react-chartjs-2 ships ESM only, so it is mocked without resolving the real module
  { virtual: true },
);

const render = (ui: React.ReactElement) => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  act(() =>
    createRoot(container).render(
      <RecoilRoot>
        <ThemeProvider theme={{ colors: theme.lightTheme, fonts: theme.fonts, device: theme.device }}>
          {ui}
        </ThemeProvider>
      </RecoilRoot>,
    ),
  );
  return { container };
};

const datas = [
  { date: "2026-11-01", value: 1.123456 },
  { date: "2026-11-02", value: 2 },
];

const hover = (dataIndex: number, caretY = 100) => {
  const canvas = { getBoundingClientRect: () => ({ width: 400, height: 200 }) };
  act(() => {
    chartProps.options.plugins.tooltip.external({
      chart: { canvas },
      tooltip: { opacity: 1, caretX: 100, caretY, width: 0, dataPoints: [{ dataIndex }] },
    });
  });
};

describe("tooltip", () => {
  beforeEach(() => {
    // The tooltip is 120px wide and 60px high
    jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      const size = this.classList.contains("tooltip-container") ? { width: 120, height: 60 } : { width: 0, height: 0 };
      return { ...size, top: 0, left: 0, right: size.width, bottom: size.height, x: 0, y: 0, toJSON: () => ({}) };
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it("shows the day, the exact balance and its value in USD", () => {
    const { container } = render(<BalanceChart datas={datas} getUsd={balance => `$${balance}0`} />);
    hover(0);

    const tooltip = container.querySelector<HTMLElement>(".tooltip-container")!;
    expect(tooltip.textContent).toContain("Nov 1, 2026");
    expect(tooltip.textContent).toContain("1.123456");
    expect(tooltip.textContent).toContain("($1.1234560)");
  });

  it("shows no USD without a price", () => {
    const { container } = render(<BalanceChart datas={datas} getUsd={() => null} />);
    hover(0);

    expect(container.querySelector(".tooltip-usd")).toBeNull();
  });

  it("sits above the hovered point, centered on it", () => {
    const { container } = render(<BalanceChart datas={datas} />);
    hover(0, 100);

    const tooltip = container.querySelector<HTMLElement>(".tooltip-container")!;
    expect(tooltip.style.top).toBe(`${100 - 60 - 12}px`);
    expect(tooltip.style.left).toBe(`${100 - 60}px`);
  });

  it("goes below the point with no room above, and stays inside the chart", () => {
    const { container } = render(<BalanceChart datas={datas} />);
    hover(0, 20);

    const tooltip = container.querySelector<HTMLElement>(".tooltip-container")!;
    expect(tooltip.style.top).toBe(`${20 + 12}px`);
  });
});

it("labels the axis by day for a short range and by month for a long one", () => {
  render(<BalanceChart datas={datas} />);
  expect(chartProps.options.scales.xAxis.ticks.callback(0, 0)).toBe("Nov 1");

  render(
    <BalanceChart
      datas={[
        { date: "2025-11-01", value: 1 },
        { date: "2026-11-01", value: 2 },
      ]}
    />,
  );
  expect(chartProps.options.scales.xAxis.ticks.callback(0, 0)).toBe("Nov 2025");
});
