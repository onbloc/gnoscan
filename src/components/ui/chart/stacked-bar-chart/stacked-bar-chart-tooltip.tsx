import React from "react";
import styled from "styled-components";

import theme from "@/styles/theme";
import { AmountText } from "../../text/amount-text";

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

export const StackedBarChartTooltip = ({ themeMode, title, datasets, isDenom }: TooltipProps) => {
  return (
    <TooltipContainer light={themeMode === "light"} datasetCount={datasets.length}>
      <div className="tooltip-header">
        <p className="tooltip-title">{title}</p>
      </div>
      <div className="tooltip-body">
        {datasets.map((dataset, index) => (
          <div key={index} className="dataset-item">
            <div className="color-indicator" style={{ backgroundColor: dataset.color }} />
            <div className="dataset-content">
              <span className="dataset-label">{dataset.label}:</span>
              <div className="dataset-value">
                {isDenom ? (
                  <AmountText denom="GNOT" maxSize="body1" minSize="body2" value={dataset.value} />
                ) : (
                  <span>{dataset.value}</span>
                )}
              </div>
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
    width: 200px; // 조금 더 넓게
    min-height: ${({ datasetCount }) => 60 + datasetCount * 28}px; // 동적 높이
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
        gap: 8px;

        .color-indicator {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .dataset-content {
          display: flex;
          flex-direction: column;
          flex: 1;

          .dataset-label {
            color: ${({ light }) => (light ? theme.lightTheme.tertiary : theme.darkTheme.tertiary)};
            ${theme.fonts.body2};
            line-height: 1.2;
          }

          .dataset-value {
            color: ${({ light }) => (light ? theme.lightTheme.primary : theme.darkTheme.primary)};
            ${theme.fonts.p4};
            line-height: 1.4;

            span {
              line-height: inherit;
            }
          }
        }
      }
    }
  }
`;
