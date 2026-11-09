import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, ChartData, ChartOptions, ScriptableContext, TooltipModel } from "chart.js";
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
  // The UTC day (YYYY-MM-DD) marked on the chart, and what a click on a day's point selects.
  selectedDate?: string | null;
  onSelectDate?: (date: string) => void;
}

// Space between the hovered point and the tooltip.
const TOOLTIP_GAP = 12;
// A range longer than this labels the axis by month, as day labels would crowd it.
const DAY_LABEL_MAX_SPAN_DAYS = 180;

const COMPACT_FRACTION_DIGITS = 2;
// The compact notation has no unit above T (10^12), which is the fourth step of 10^3.
const MAX_COMPACT_UNIT_EXP = 4;
const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: COMPACT_FRACTION_DIGITS,
});

// GNOT has six decimal places.
const MAX_AXIS_FRACTION_DIGITS = 6;
const Y_TICK_COUNT = 5;
// Radius of the point of a history with a single day, which has no line to show.
const SINGLE_POINT_RADIUS = 3;
// Radius of the point of the selected day.
const SELECTED_POINT_RADIUS = 5;

/**
 * Formats a Y-axis tick so that the ticks of the axis stay distinct. The compact notation (1.5M) is used only when
 * the tick interval is at least one step of its precision, else it would round neighbouring ticks to the same
 * label (30,305 and 30,306 are both 30.31K); the labels are then plain decimals.
 */
export const formatBalanceAxisTick = (value: number, tickValues: number[]) => {
  const step = tickValues.length > 1 ? Math.abs(tickValues[1] - tickValues[0]) : 0;
  if (!(step > 0)) {
    return compactNumber.format(value);
  }

  // The unit (1K, 1M, ...) the compact notation gives the largest tick, which the axis shares.
  const magnitude = Math.max(...tickValues.map(Math.abs));
  const unit =
    magnitude >= 1000 ? 10 ** (3 * Math.min(Math.floor(Math.log10(magnitude) / 3), MAX_COMPACT_UNIT_EXP)) : 1;
  if (step >= 1 && step >= unit * 10 ** -COMPACT_FRACTION_DIGITS) {
    return compactNumber.format(value);
  }

  const digits = step >= 1 ? 0 : Math.min(Math.ceil(-Math.log10(step)) + 1, MAX_AXIS_FRACTION_DIGITS);
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

export const BalanceChart = ({ datas, getUsd, selectedDate, onSelectDate }: BalanceChartProps) => {
  const themeMode = useRecoilValue(themeState);
  const palette = getChartPalette(themeMode);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState({ title: "", value: "" });
  const anchorRef = useRef({ caretX: 0, caretY: 0, chartWidth: 0 });
  // The index of the day whose tooltip is shown, which is the day a click selects.
  const hoveredIndexRef = useRef<number | null>(null);

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
      hoveredIndexRef.current = null;
      chart.canvas.style.cursor = "default";
      return;
    }

    const dataIndex = tooltip.dataPoints[0]?.dataIndex;
    const point = datas[dataIndex];
    if (!point) {
      return;
    }

    const title = formatChartDate(point.date, CHART_FULL_DATE_FORMAT);
    // The exact decimal, not the plotting value, which has lost precision.
    const value = point.balance;
    if (title !== currentValue.title || value !== currentValue.value) {
      setCurrentValue({ title, value });
    }

    hoveredIndexRef.current = dataIndex;
    chart.canvas.style.cursor = onSelectDate ? "pointer" : "default";
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
            const values = ticks.map(tick => tick.value);
            return formatBalanceAxisTick(Number(tickValue), values);
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
    onClick: () => {
      const point = hoveredIndexRef.current === null ? undefined : datas[hoveredIndexRef.current];
      if (point) {
        onSelectDate?.(point.date);
      }
    },
  };

  const selectedIndex = selectedDate ? datas.findIndex(data => data.date === selectedDate) : -1;

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
        pointRadius: (context: ScriptableContext<"line">) =>
          context.dataIndex === selectedIndex ? SELECTED_POINT_RADIUS : datas.length === 1 ? SINGLE_POINT_RADIUS : 0,
        pointBorderWidth: (context: ScriptableContext<"line">) => (context.dataIndex === selectedIndex ? 2 : 0),
        pointBorderColor: "#FFFFFF",
        pointHitRadius: 0,
        pointHoverRadius: (context: ScriptableContext<"line">) =>
          context.dataIndex === selectedIndex ? SELECTED_POINT_RADIUS : 2,
        pointHoverBorderWidth: 1,
        pointHoverBorderColor: palette.blue,
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
