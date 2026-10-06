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
import { BarChart } from "./bar-chart";

jest.mock("@/states", () => {
  const { atom } = jest.requireActual("recoil");
  return { themeState: atom({ key: "themeState", default: "light" }) };
});

let chartOptions: any;
jest.mock(
  "react-chartjs-2",
  () => {
    const { Component } = jest.requireActual("react");
    return {
      Bar: class Bar extends Component<any> {
        render() {
          chartOptions = this.props.options;
          return null;
        }
      },
    };
  },
  // react-chartjs-2 ships ESM only, so it is mocked without resolving the real module
  { virtual: true },
);

// Tooltip width follows its rendered text so a stale measurement shows up as a wrong position.
const widthOf = (el: Element) => 20 + (el.textContent || "").length * 4;

beforeEach(() => {
  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    const width = this.classList.contains("tooltip-container") ? widthOf(this) : 0;
    return { width, height: 0, top: 0, left: 0, right: width, bottom: 0, x: 0, y: 0, toJSON: () => ({}) };
  });
});

afterEach(() => jest.restoreAllMocks());

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

it("keeps the tooltip inside the chart using the width of the newly rendered value", () => {
  const { container } = render(<BarChart labels={["2026-01-01"]} datas={[{ date: "2026-01-01", value: 1 }]} />);
  const canvas = { getBoundingClientRect: () => ({ width: 400, height: 200 }) };

  act(() => {
    chartOptions.plugins.tooltip.external({
      chart: { canvas },
      tooltip: {
        opacity: 1,
        caretX: 300,
        width: 0,
        title: ["Jan 1, 2026"],
        dataPoints: [{ formattedValue: "123,456,789.123456" }],
      },
    });
  });

  const tooltip = container.querySelector<HTMLElement>(".tooltip-container")!;
  expect(tooltip.textContent).toContain("123,456,789.123456");
  expect(tooltip.style.left).toBe(`${400 - widthOf(tooltip) + 20}px`);
});
