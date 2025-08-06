import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import BigNumber from "bignumber.js";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

import { themeState } from "@/states";
import theme from "@/styles/theme";

interface StackedBarChart2Props {
  labels?: Array<string>;
  data?: Array<{ date: string; value: string }>;
}

interface EChartsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
  }>;
}

export const StackedBarChart2 = ({}: StackedBarChart2Props) => {
  const [themeMode] = useRecoilState(themeState);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartInstanceRef = React.useRef<echarts.ECharts | null>(null);

  const themePalette = React.useMemo(() => {
    return themeMode === "light" ? theme.lightTheme : theme.darkTheme;
  }, [themeMode]);

  const [chartData, setChartData] = React.useState<EChartsData>({
    labels: ["2025-07-30", "2025-07-31", "2025-08-01", "2025-08-02", "2025-08-03", "2025-08-04", "2025-08-05"],
    datasets: [
      {
        label: "Total Deposited",
        data: [280, 420, 160.123123, 350.95211212, 480.123123, 600, 700],
        backgroundColor: themePalette.blue,
      },
      {
        label: "Daily Deposited",
        data: [320, 180, 450, 280, 162, 100, 100],
        backgroundColor: themePalette.orange,
      },
    ],
  });

  const tooltipInlineStyles = React.useMemo(
    () => ({
      container: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      },
      title: {
        color: themePalette.tertiary,
        fontSize: "12px",
        fontWeight: "400",
      },
      itemContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      },
      itemRow: {
        display: "flex",
        alignItems: "center",
        gap: "44px",
      },
      labelContainer: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
      },
      colorDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50px",
      },
      labelText: {
        color: themePalette.primary,
        fontSize: "12px",
        fontWeight: "400",
      },
      valueContainer: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        flexDirection: "column",
        flex: "1",
        gap: "1px",
        lineHeight: "16px",
      },
      valueText: {
        color: themePalette.primary,
        fontSize: "11px",
      },
      integerPart: {
        color: themePalette.primary,
        fontSize: "11px",
        fontWeight: "600",
      },
      decimalPart: {
        color: themePalette.primary,
        fontSize: "10px",
      },
      denomText: {
        color: themePalette.primary,
        fontSize: "9px",
        marginLeft: "2px",
      },
    }),
    [themePalette],
  );

  const styleToString = React.useCallback((styleObj: Record<string, string | number>) => {
    return Object.entries(styleObj)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join("; ");
  }, []);

  const formatAmountText = React.useCallback(
    (value: number | string | undefined | null, decimals = 6): { integer: string; decimal: string } => {
      if (value === undefined || value === null) {
        return { integer: "0", decimal: "" };
      }

      const valueStr = typeof value === "string" ? value.replace(/,/g, "") : value.toString();
      if (new BigNumber(valueStr).isNaN() || valueStr.length === 0) {
        return { integer: "0", decimal: "" };
      }

      const numbers = valueStr.split(".");
      const integer = new BigNumber(numbers[0]).toFormat(0);

      if (numbers.length > 1 && numbers[1] !== "0") {
        const decimal = numbers[1].slice(0, decimals);
        return { integer, decimal: `.${decimal}` };
      }

      return { integer, decimal: "" };
    },
    [],
  );

  const renderTooltipItem = React.useCallback(
    (param: echarts.DefaultLabelFormatterCallbackParams) => {
      const backgroundColor = param.color ? param.color.toString() : themePalette.primary;
      const colorDotStyle = { ...tooltipInlineStyles.colorDot, background: backgroundColor };

      const value = param.value as number | string | null | undefined;
      const { integer, decimal } = formatAmountText(value);

      return `
      <div style="${styleToString(tooltipInlineStyles.itemRow)}">
        <div style="${styleToString(tooltipInlineStyles.labelContainer)}">
          <div style="${styleToString(colorDotStyle)}"></div>
          <div style="${styleToString(tooltipInlineStyles.labelText)}">${param.seriesName}</div>
        </div>
        <div style="${styleToString(tooltipInlineStyles.valueContainer)}">
          <div style="${styleToString(tooltipInlineStyles.valueText)}">
          <span style="${styleToString(tooltipInlineStyles.integerPart)}">${integer}</span><span style="${styleToString(
        tooltipInlineStyles.decimalPart,
      )}">${decimal}</span><span style="${styleToString(tooltipInlineStyles.denomText)}">GNOT</span></div>
          <div style="${styleToString(tooltipInlineStyles.denomText)}">(15.123KB)</div>
        </div>
      </div>
    `;
    },
    [tooltipInlineStyles, styleToString, formatAmountText],
  );

  const createEChartsOption = (): EChartsOption => {
    return {
      animation: true,
      animationDuration: 200,
      animationEasing: "cubicOut",

      grid: {
        left: "0",
        right: "0",
        top: "0",
        bottom: "0",
        containLabel: false,
        borderColor: themePalette.dimmed50,
      },

      legend: {
        show: false,
      },

      xAxis: {
        type: "category",
        data: chartData.labels,
        axisLine: {
          show: true,
          lineStyle: {
            color: themePalette.dimmed100,
          },
        },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },

      yAxis: {
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: themePalette.dimmed100,
          },
        },
        axisTick: { show: false },
        axisLabel: {
          color: themePalette.tertiary,
          fontSize: 12,
          padding: 10,
        },

        splitLine: {
          show: true,
          lineStyle: {
            color: themePalette.dimmed50,
            type: [4, 2],
            width: 1,
          },
        },
      },

      tooltip: {
        show: true,
        confine: true,
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: themePalette.dimmed50,
          },
        },
        // Tooltip component style
        borderWidth: 0,
        borderRadius: 8,
        backgroundColor: themePalette.base,
        extraCssText: "box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); padding: 11px 15px",

        formatter: (params: echarts.TooltipComponentFormatterCallbackParams) => {
          const paramsArray = Array.isArray(params) ? params : [params];

          const title = `<div style="${styleToString(tooltipInlineStyles.title)}">${paramsArray[0].name}</div>`;

          const items = paramsArray
            .map(
              param => `
            <div style="${styleToString(tooltipInlineStyles.itemContainer)}">
              ${renderTooltipItem(param)}
            </div>
          `,
            )
            .join("");

          return `
            <div style="${styleToString(tooltipInlineStyles.container)}">
              ${title}
              ${items}
            </div>
          `;
        },
      },

      series: chartData.datasets.map((dataset, index) => ({
        name: dataset.label,
        type: "bar" as const,
        stack: "total",
        barWidth: "70%",
        data: dataset.data,
        itemStyle: {
          color: dataset.backgroundColor,
        },
        emphasis: {
          focus: "series" as const,
          blurScope: "coordinateSystem" as const,
        },
      })),

      color: chartData.datasets.map(dataset => dataset.backgroundColor),
    };
  };

  React.useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const option = createEChartsOption();
    chartInstanceRef.current.setOption(option, true);

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [themeMode, chartData]);

  React.useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <Wrapper ref={wrapperRef}>
      <ChartContainer ref={chartRef} />
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
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;
