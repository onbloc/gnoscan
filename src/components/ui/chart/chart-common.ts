import { RefObject, useEffect } from "react";
import { Chart, ChartType, TooltipModel } from "chart.js";
import styled, { css } from "styled-components";
import theme, { Palette } from "@/styles/theme";

export const getChartPalette = (themeMode: string | null | undefined): Palette =>
  themeMode === "light" ? theme.lightTheme : theme.darkTheme;

export const createBaseChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
});

export const createValueAxisStyle = (palette: Palette) => ({
  grid: {
    color: palette.dimmed50,
  },
  border: {
    dash: [4, 2],
  },
});

export const createExternalTooltipPlugins = <T extends ChartType>(
  external: (context: { chart: Chart<T>; tooltip: TooltipModel<T> }) => void,
) => ({
  legend: {
    display: false,
  },
  title: {
    display: false,
  },
  tooltip: {
    enabled: false,
    position: "average" as const,
    displayColors: false,
    external,
  },
});

/**
 * Returns the tooltip element when the chart tooltip is active, otherwise hides it and returns null.
 */
export const getActiveTooltipElement = <T extends ChartType>(
  tooltipRef: RefObject<HTMLDivElement>,
  tooltip: TooltipModel<T>,
): HTMLDivElement | null => {
  const tooltipElement = tooltipRef.current;
  if (!tooltipElement) {
    return null;
  }

  if (tooltip.opacity === 0) {
    tooltipElement.style.opacity = "0";
    return null;
  }

  return tooltipElement;
};

export const useHideTooltipOnScroll = (tooltipRef: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const hideTooltip = () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("scroll", hideTooltip);
    return () => {
      window.removeEventListener("scroll", hideTooltip);
    };
  }, [tooltipRef]);
};

export const tooltipAnchorStyle = css`
  position: absolute;
  display: flex;
  width: fit-content;
  height: fit-content;
`;

export const ChartTooltipContainer = styled.div<{ light: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ light }) => (light ? theme.lightTheme.base : theme.darkTheme.base)};
  padding: 16px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
`;
