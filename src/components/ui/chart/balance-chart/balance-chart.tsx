import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, ChartData, ChartOptions, TooltipModel } from "chart.js";
import BigNumber from "bignumber.js";
import { useRecoilValue } from "recoil";
import { styled } from "@/styles";
import { themeState } from "@/states";
import { zindex } from "@/common/values/z-index";
import { BarChartTooltip } from "../bar-chart/bar-chart-tooltip";
import {
  createBaseChartOptions,
  createExternalTooltipPlugins,
  createValueAxisStyle,
  formatChartDate,
  getActiveTooltipElement,
  getChartPalette,
  tooltipAnchorStyle,
  useHideTooltipOnScroll,
} from "../chart-common";

interface BalanceChartProps {
  // Daily closing balances in GNOT, oldest first. `date` is a UTC day (YYYY-MM-DD).
  datas: Array<{ date: string; value: number }>;
}

const DAY_MS = 24 * 60 * 60 * 1000;
// A range longer than this labels the axis by month, as day labels would crowd it.
const DAY_LABEL_MAX_SPAN_DAYS = 180;

const TOOLTIP_DATE_FORMAT: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });

const spanInDays = (datas: BalanceChartProps["datas"]) => {
  if (datas.length < 2) return 0;
  return (Date.parse(datas[datas.length - 1].date) - Date.parse(datas[0].date)) / DAY_MS;
};

export const BalanceChart = ({ datas }: BalanceChartProps) => {
  const chartRef = useRef<Chart<"line">>(null);
  const themeMode = useRecoilValue(themeState);
  const palette = getChartPalette(themeMode);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState({ title: "", value: "" });
  const anchorRef = useRef({ left: 0, chartWidth: 0 });

  useHideTooltipOnScroll(tooltipRef);

  // Measures the tooltip as currently rendered so a wider value is clamped by its real width.
  const positionTooltip = () => {
    const tooltipElement = tooltipRef.current;
    const { left, chartWidth } = anchorRef.current;
    if (!tooltipElement || !chartWidth) {
      return;
    }

    const { width } = tooltipElement.getBoundingClientRect();
    const maxLeft = Math.max(chartWidth - width, 0);
    tooltipElement.style.left = Math.min(Math.max(left, 0), maxLeft) + "px";
  };

  // Runs after a new value renders and before paint, so the clamp uses the updated width.
  useLayoutEffect(positionTooltip, [currentValue]);

  const axisDateFormat = useMemo<Intl.DateTimeFormatOptions>(
    () =>
      spanInDays(datas) > DAY_LABEL_MAX_SPAN_DAYS
        ? { month: "short", year: "numeric" }
        : { month: "short", day: "numeric" },
    [datas],
  );

  const renderExternalTooltip = (context: { chart: Chart<"line">; tooltip: TooltipModel<"line"> }) => {
    const { chart, tooltip } = context;
    const currentTooltip = getActiveTooltipElement(tooltipRef, tooltip);
    if (!currentTooltip) {
      return;
    }

    const point = datas[tooltip.dataPoints[0]?.dataIndex];
    if (!point) {
      return;
    }

    // The exact decimal, as the chart's own formatted value keeps three decimals at most.
    const title = formatChartDate(point.date, TOOLTIP_DATE_FORMAT);
    const value = BigNumber(point.value).toFixed();
    if (title !== currentValue.title || value !== currentValue.value) {
      setCurrentValue({ title, value });
    }

    currentTooltip.style.opacity = "1";

    const position = chart.canvas.getBoundingClientRect();
    currentTooltip.style.position = "absolute";
    currentTooltip.style.marginTop = -position.height + "px";

    anchorRef.current = { left: tooltip.caretX - tooltip.width / 2, chartWidth: position.width };
    positionTooltip();
  };

  const options: ChartOptions<"line"> = {
    ...createBaseChartOptions(),
    scales: {
      yAxis: {
        ...createValueAxisStyle(palette),
        ticks: {
          color: palette.tertiary,
          count: 5,
          callback: tickValue => compactNumber.format(Number(tickValue)),
        },
      },
      xAxis: {
        ticks: {
          color: palette.tertiary,
          maxTicksLimit: 6,
          autoSkipPadding: 16,
          maxRotation: 0,
          callback: (_, index) => formatChartDate(datas[index]?.date ?? "", axisDateFormat),
        },
        grid: {
          color: "#00000000",
        },
      },
    },
    plugins: createExternalTooltipPlugins(renderExternalTooltip),
  };

  const chartData: ChartData<"line"> = {
    labels: datas.map(data => data.date),
    datasets: [
      {
        yAxisID: "yAxis",
        xAxisID: "xAxis",
        data: datas.map(data => data.value),
        fill: true,
        borderWidth: 1,
        borderColor: palette.blue,
        backgroundColor: `${palette.blue}26`,
        cubicInterpolationMode: "monotone",
        pointRadius: 0,
        pointBorderWidth: 0,
        pointHitRadius: 0,
        pointHoverRadius: 2,
        pointHoverBorderWidth: 1,
        pointHoverBackgroundColor: "#FFFFFF",
        pointBackgroundColor: palette.blue,
      },
    ],
  };

  return (
    <Wrapper>
      <div className="tooltip-container" ref={tooltipRef} style={{ opacity: 0 }}>
        <BarChartTooltip isDenom themeMode={`${themeMode}`} title={currentValue.title} value={currentValue.value} />
      </div>
      <Line ref={chartRef} width={"100%"} height={"100%"} options={options} data={chartData} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  & {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .tooltip-container {
      ${tooltipAnchorStyle};
      z-index: ${zindex.tooltip};
    }
  }
`;
