import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { Chart, ChartData, ChartOptions, registerables, TooltipModel } from "chart.js";
import { Bar } from "react-chartjs-2";

import { themeState } from "@/states";
import { zindex } from "@/common/values/z-index";
import theme from "@/styles/theme";
import { StackedBarChartTooltip } from "./stacked-bar-chart-tooltip";

Chart.register(...registerables);

interface StackedBarChartProps {
  labels?: Array<string>;
  data?: Array<{ date: string; value: string }>;
}

export const StackedBarChart = ({}: StackedBarChartProps) => {
  const [themeMode, setThemeMode] = useRecoilState(themeState);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<Chart<"bar">>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const [chartData, setChartData] = React.useState<ChartData<"bar">>({
    labels: ["2025-07-30", "2025-07-31", "2025-08-01", "2025-08-02", "2025-08-03", "2025-08-04", "2025-08-05"],
    datasets: [
      {
        label: "Total Deposited",
        data: [280, 420, 160.123123, 350.95211212, 480.123123, 600, 700],
        backgroundColor: "rgb(53, 162, 235)",
      },
      {
        label: "Daily Deposited",
        data: [320, 180, 450, 280, 162, 70, 100, 50],
        backgroundColor: "rgb(224, 125, 54)",
      },
    ],
  });

  // const [currentValue, setCurrentValue] = React.useState({
  //   title: "2025-05-05",
  //   datasets: [
  //     {
  //       label: "Total Deposited",
  //       value: "480",
  //       color: "rgb(53, 162, 235)",
  //     },
  //     {
  //       label: "Daily Deposited",
  //       value: "620",
  //       color: "rgb(224, 125, 54)",
  //     },
  //   ] as Array<{ label: string; value: string; color: string }>,
  // });
  const [currentValue, setCurrentValue] = React.useState({
    title: "",
    datasets: [] as Array<{ label: string; value: string; color: string }>,
  });

  const getThemePalette = () => {
    return themeMode === "light" ? theme.lightTheme : theme.darkTheme;
  };

  const createChartOption = (): ChartOptions<"bar"> => {
    const themePalette = getThemePalette();

    return {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      animation: {
        duration: 200,
      },
      scales: {
        x: {
          stacked: true,
          type: "category",
          ticks: {
            display: false,
          },
          grid: {
            color: "transparent",
          },
        },
        y: {
          stacked: true,
          type: "linear",
          position: "left",
          ticks: {
            color: themePalette.tertiary,
            count: 5,
            format: {
              minimumFractionDigits: 0,
              maximumFractionDigits: 6,
            },
          },
          grid: {
            color: themePalette.dimmed50,
          },
          border: {
            dash: [4, 2],
          },
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },

      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: false,
          position: "average",
          displayColors: false,
          external: renderCustomTooltip,
        },
      },
    };
  };

  const renderCustomTooltip = (context: { chart: Chart<"bar">; tooltip: TooltipModel<"bar"> }) => {
    const { chart, tooltip } = context;

    if (!tooltipRef.current) {
      return;
    }

    const currentTooltip = tooltipRef.current;
    const tooltipModel = tooltip;

    if (tooltipModel.opacity === 0) {
      currentTooltip.style.opacity = "0";
      return;
    }

    const tooltipData = {
      title: "",
      datasets: [] as Array<{ label: string; value: string; color: string }>,
    };

    if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
      tooltipData.title = tooltip.title[0] || "";

      tooltip.dataPoints.forEach(dataPoint => {
        const value = Number(dataPoint.raw);
        tooltipData.datasets.push({
          label: dataPoint.dataset.label || "",
          value: value.toLocaleString(),
          color: (dataPoint.dataset.backgroundColor as string) || "#000",
        });
      });
    }

    if (
      tooltipData.title !== currentValue.title ||
      JSON.stringify(tooltipData.datasets) !== JSON.stringify(currentValue.datasets)
    ) {
      setCurrentValue({
        title: tooltipData.title,
        datasets: tooltipData.datasets,
      });
    }

    currentTooltip.style.opacity = "1";

    const tooltipRect = currentTooltip.getBoundingClientRect();
    const position = chart.canvas.getBoundingClientRect();
    currentTooltip.style.position = "absolute";
    currentTooltip.style.marginTop = -position.height + "px";

    const left = tooltipModel.caretX - tooltipModel.width / 2;
    const leftLimit = position.width - tooltipRect.width + 20;
    if (left + tooltipRect.width > position.width) {
      currentTooltip.style.left = leftLimit + "px";
    } else {
      currentTooltip.style.left = left + "px";
    }
  };

  return (
    <Wrapper ref={wrapperRef}>
      <div className="tooltip-container" ref={tooltipRef} style={{ opacity: 0 }}>
        <StackedBarChartTooltip themeMode={themeMode} title={currentValue.title} datasets={currentValue.datasets} />
      </div>
      <Bar ref={chartRef} width={"100%"} height={"100%"} options={createChartOption()} data={chartData} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  & {
    display: flex;
    width: 100%;
    height: calc(100% - 40px);
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .tooltip-container {
      position: absolute;
      display: flex;
      width: fit-content;
      height: fit-content;
      z-index: ${zindex.tooltip};
    }
  }
`;
