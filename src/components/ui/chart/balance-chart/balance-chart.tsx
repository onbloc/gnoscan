import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, ChartData, ChartOptions, TooltipModel } from "chart.js";
import { useRecoilValue } from "recoil";
import { styled } from "@/styles";
import { themeState } from "@/states";
import { DAY_TIME } from "@/common/values/constant-value";
import { zindex } from "@/common/values/z-index";
import { BalanceChartTooltip } from "./balance-chart-tooltip";
import {
  CHART_FULL_DATE_FORMAT,
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
  // Daily closing balances in GNOT, oldest first. `date` is a UTC day (YYYY-MM-DD); `balance` is the exact decimal
  // shown in the tooltip and `value` is its plotting value.
  datas: Array<{ date: string; balance: string; value: number }>;
  // Display value of a balance (an exact decimal in GNOT) in USD; null when there is no price.
  getUsd?: (balance: string) => string | null;
}

// Space between the hovered point and the tooltip.
const TOOLTIP_GAP = 12;
// A range longer than this labels the axis by month, as day labels would crowd it.
const DAY_LABEL_MAX_SPAN_DAYS = 180;

const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });

// GNOT has six decimal places.
const MAX_AXIS_FRACTION_DIGITS = 6;
const Y_TICK_COUNT = 5;
// Radius of the point of a history with a single day, which has no line to show.
const SINGLE_POINT_RADIUS = 3;

/**
 * Formats a Y-axis tick, keeping enough decimals to tell apart ticks `step` apart. Compact notation hides
 * fractions, so it is used only when the ticks are at least 1 apart.
 */
export const formatBalanceAxisTick = (value: number, step: number) => {
  if (!(step > 0) || step >= 1) {
    return compactNumber.format(value);
  }

  const digits = Math.min(Math.max(Math.ceil(-Math.log10(step)) + 1, 0), MAX_AXIS_FRACTION_DIGITS);
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
};

/**
 * The number of Y ticks. Ticks split the range evenly, so a range of a few ugnot would put ticks between two
 * ugnots, which no label can tell apart; it gets one tick per ugnot instead.
 */
export const getBalanceTickCount = (values: number[]) => {
  const range = values.length === 0 ? 0 : Math.max(...values) - Math.min(...values);
  const ugnots = Math.round(range * 10 ** MAX_AXIS_FRACTION_DIGITS);
  return ugnots > 0 ? Math.min(Y_TICK_COUNT, ugnots + 1) : Y_TICK_COUNT;
};

const spanInDays = (datas: BalanceChartProps["datas"]) => {
  if (datas.length < 2) return 0;
  return (Date.parse(datas[datas.length - 1].date) - Date.parse(datas[0].date)) / DAY_TIME;
};

export const BalanceChart = ({ datas, getUsd }: BalanceChartProps) => {
  const themeMode = useRecoilValue(themeState);
  const palette = getChartPalette(themeMode);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState({ title: "", value: "" });
  const anchorRef = useRef({ caretX: 0, caretY: 0, chartWidth: 0 });

  useHideTooltipOnScroll(tooltipRef);

  // Sits above the hovered point, or below it with no room above, and stays within the chart. It is measured as
  // currently rendered, so a wider value is clamped by its real size.
  const positionTooltip = () => {
    const tooltipElement = tooltipRef.current;
    const { caretX, caretY, chartWidth } = anchorRef.current;
    if (!tooltipElement || !chartWidth) {
      return;
    }

    const { width, height } = tooltipElement.getBoundingClientRect();
    const left = Math.min(Math.max(caretX - width / 2, 0), Math.max(chartWidth - width, 0));
    const above = caretY - height - TOOLTIP_GAP;
    tooltipElement.style.left = left + "px";
    tooltipElement.style.top = (above >= 0 ? above : caretY + TOOLTIP_GAP) + "px";
  };

  // Runs after a new value renders and before paint, so the clamp uses the updated width.
  useLayoutEffect(positionTooltip, [currentValue]);

  const tickCount = useMemo(() => getBalanceTickCount(datas.map(data => data.value)), [datas]);

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

    const title = formatChartDate(point.date, CHART_FULL_DATE_FORMAT);
    // The exact decimal, not the plotting value, which has lost precision.
    const value = point.balance;
    if (title !== currentValue.title || value !== currentValue.value) {
      setCurrentValue({ title, value });
    }

    currentTooltip.style.opacity = "1";

    anchorRef.current = {
      caretX: tooltip.caretX,
      caretY: tooltip.caretY,
      chartWidth: chart.canvas.getBoundingClientRect().width,
    };
    positionTooltip();
  };

  const options: ChartOptions<"line"> = {
    ...createBaseChartOptions(),
    scales: {
      yAxis: {
        ...createValueAxisStyle(palette),
        ticks: {
          color: palette.tertiary,
          count: tickCount,
          callback: (tickValue, index, ticks) => {
            const step = ticks.length > 1 ? Math.abs(ticks[1].value - ticks[0].value) : 0;
            return formatBalanceAxisTick(Number(tickValue), step);
          },
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
        pointRadius: datas.length === 1 ? SINGLE_POINT_RADIUS : 0,
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
        <BalanceChartTooltip
          themeMode={`${themeMode}`}
          title={currentValue.title}
          value={currentValue.value}
          usd={currentValue.value ? getUsd?.(currentValue.value) : null}
        />
      </div>
      <Line width={"100%"} height={"100%"} options={options} data={chartData} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  & {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .tooltip-container {
      ${tooltipAnchorStyle};
      z-index: ${zindex.tooltip};
      top: 0;
      left: 0;
      pointer-events: none;
    }
  }
`;
