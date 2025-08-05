import React from "react";
import styled from "styled-components";

import theme from "@/styles/theme";
import { AmountText } from "../../text/amount-text";
import { ColorCircleIndicator } from "../../color-circle-indicator/ColorCircleIndicator";

interface Dataset {
  label: string;
  value: string;
  color: string;
}

interface TooltipProps {
  title: string;
  datasets: Dataset[];
  themeMode: string;
  isDenom?: boolean;
}

export const StackedBarChartTooltip = ({ themeMode, title, datasets, isDenom = true }: TooltipProps) => {
  return (
    <TooltipContainer light={themeMode === "light"} datasetCount={datasets.length}>
      <div className="tooltip-header">
        <p className="tooltip-title">{title}</p>
      </div>
      <div className="tooltip-body">
        {datasets.map((dataset, index) => (
          <div key={index} className="dataset-item">
            <div className="dataset-key">
              <ColorCircleIndicator color={dataset.color} />
              <span className="dataset-label">{dataset.label}</span>
            </div>
            <div className="dataset-content">
              <div className="dataset-value">
                {isDenom ? (
                  <AmountText denom="GNOT" maxSize="body1" minSize="body2" value={dataset.value} bold={true} />
                ) : (
                  <span>{dataset.value}</span>
                )}
              </div>
              <div className="dataset-value">(24.152341KB)</div>
            </div>
          </div>
        ))}
      </div>
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div<{ light: boolean; datasetCount: number }>`
  & {
    display: flex;
    flex-direction: column;
    background-color: ${({ light }) => (light ? theme.lightTheme.base : theme.darkTheme.base)};
    padding: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;

    .tooltip-header {
      color: ${({ light }) => (light ? theme.lightTheme.tertiary : theme.darkTheme.tertiary)};
      margin-bottom: 8px;
      ${theme.fonts.body1};
    }

    .tooltip-body {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .dataset-item {
        display: flex;
        align-items: center;
        gap: 24px;

        .dataset-key {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 4px;

          font-size: 12px;
          font-weight: 400;
        }

        .dataset-content {
          display: flex;
          flex-direction: column;
          flex: 1;

          .dataset-value {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            color: ${({ light }) => (light ? theme.lightTheme.primary : theme.darkTheme.primary)};
            font-size: 11px;

            span {
              line-height: inherit;
            }
          }
        }
      }
    }
  }
`;
