import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import BigNumber from "bignumber.js";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

import { themeState } from "@/states";
import theme from "@/styles/theme";
import { TotalDailyStorageDeposit } from "@/types";
import { formatBytes } from "@/common/utils/format/format-utils";

export interface TotalDailyStorageDepositWithPrice extends TotalDailyStorageDeposit {
  totalStorageUsage: number;
  dailyStorageUsage: number;
}

interface StackedBarChart2Props {
  labels: string[];
  chartData?: TotalDailyStorageDepositWithPrice[];
}

export const StackedBarChart2 = ({ labels, chartData }: StackedBarChart2Props) => {
  const [themeMode] = useRecoilState(themeState);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartInstanceRef = React.useRef<echarts.ECharts | null>(null);

  const themePalette = React.useMemo(() => {
    return themeMode === "light" ? theme.lightTheme : theme.darkTheme;
  }, [themeMode]);

  const eChartsData = React.useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const originalTotalDepositedData = chartData.map(item => item.totalStorageDepositAmount);
    const originalTodayDepositedData = chartData.map(item => {
      return new BigNumber(item.storageDepositAmount || 0)
        .minus(new BigNumber(item.unlockDepositAmount || 0))
        .toNumber();
    });

    const baseValues = originalTotalDepositedData.map((total, index) => {
      const dailyChange = originalTodayDepositedData[index];
      if (dailyChange >= 0) {
        return new BigNumber(total).minus(dailyChange).toNumber();
      } else {
        return total;
      }
    });
    const dailyValues = originalTodayDepositedData.map(value => Math.abs(value));

    const totalStorageUsageData = chartData.map(item => item.totalStorageUsage);
    const dailyStorageUsageData = chartData.map(item => item.dailyStorageUsage);

    return {
      labels,
      datasets: [
        {
          label: "Total Deposited",
          data: baseValues,
          backgroundColor: themePalette.blue,
          originalData: originalTotalDepositedData,
          storageUsageData: totalStorageUsageData,
        },
        {
          label: "Daily Deposited",
          data: dailyValues,
          backgroundColor: themePalette.orange,
          originalData: originalTodayDepositedData,
          storageUsageData: dailyStorageUsageData,
        },
      ],
    };
  }, [chartData, themePalette.blue, themePalette.orange]);

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

  const extractSafeParamValue = React.useCallback((value: unknown): number | string | null => {
    if (typeof value === "number" || typeof value === "string") {
      return value;
    }
    if (value === null || value === undefined) {
      return null;
    }
    return null;
  }, []);

  const renderTooltipItem = React.useCallback(
    (param: echarts.DefaultLabelFormatterCallbackParams, storageUsage?: number) => {
      const backgroundColor = param.color ? param.color.toString() : themePalette.primary;
      const colorDotStyle = { ...tooltipInlineStyles.colorDot, background: backgroundColor };

      const safeValue = extractSafeParamValue(param.value);
      const { integer, decimal } = formatAmountText(safeValue);

      let formattedStorageUsage = { value: "0", unit: "B" };
      try {
        if (storageUsage !== undefined && !isNaN(storageUsage)) {
          formattedStorageUsage = formatBytes(storageUsage.toString());
        }
      } catch (error) {
        console.error("Error formatting storage usage:", error);
      }

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
          <div style="${styleToString(tooltipInlineStyles.denomText)}">(${formattedStorageUsage.value} ${
        formattedStorageUsage.unit
      })</div>
        </div>
      </div>
    `;
    },
    [tooltipInlineStyles, styleToString, formatAmountText, extractSafeParamValue],
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
        data: eChartsData.labels,
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
            .map(param => {
              let originalValue = param.value;
              let storageUsage: number | undefined = undefined;

              if (param.seriesIndex !== undefined && param.dataIndex !== undefined) {
                const dataset = eChartsData.datasets[param.seriesIndex];
                if (dataset) {
                  originalValue = dataset.originalData[param.dataIndex];

                  if (dataset.storageUsageData && dataset.storageUsageData.length > param.dataIndex) {
                    storageUsage = dataset.storageUsageData[param.dataIndex];
                  }
                }
              }

              const customParam = { ...param, value: originalValue };
              return `
        <div style="${styleToString(tooltipInlineStyles.itemContainer)}">
          ${renderTooltipItem(customParam, storageUsage)}
        </div>
      `;
            })
            .join("");

          return `
            <div style="${styleToString(tooltipInlineStyles.container)}">
              ${title}
              ${items}
            </div>
          `;
        },
      },

      series: eChartsData.datasets.map(dataset => ({
        name: dataset.label,
        type: "bar" as const,
        stack: "total",
        barWidth: "70%",
        data: dataset.data,
        itemStyle: {
          color:
            dataset.label === "Daily Deposited"
              ? (params: echarts.DefaultLabelFormatterCallbackParams) => {
                  const originalValue = dataset.originalData[params.dataIndex];
                  return originalValue < 0 ? themePalette.gray300 : dataset.backgroundColor;
                }
              : dataset.backgroundColor,
        },
        emphasis: {
          focus: "series" as const,
          blurScope: "coordinateSystem" as const,
        },
      })),

      color: eChartsData.datasets.map(dataset => dataset.backgroundColor),
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
  }, [themeMode, eChartsData]);

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
