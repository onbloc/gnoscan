import theme, { Palette } from "@/styles/theme";
import React from "react";
import styled from "styled-components";
import { AmountText } from "../../text/amount-text";

interface TooltipProps {
  title: string;
  value: string;
  themeMode: string;
  isDenom?: boolean;
}

export const BarChartTooltip = ({ themeMode, title, value, isDenom }: TooltipProps) => {
  return (
    <TooltipContainer light={themeMode === "light"}>
      <div className="tooltip-header">
        <p className="tooltip-title">{title}</p>
      </div>
      <div className="tooltip-body">
        <div className="tooltip-content">
          {isDenom ? <AmountText denom="GNOT" maxSize="body1" minSize="body2" value={value} /> : <span>{value}</span>}
        </div>
      </div>
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div<{ light: boolean }>`
  & {
    display: flex;
    flex-direction: column;
    width: 156px;
    height: 84px;
    background-color: ${({ light }) => (light ? theme.lightTheme.base : theme.darkTheme.base)};
    padding: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;

    .tooltip-header {
      color: ${({ light }) => (light ? theme.lightTheme.tertiary : theme.darkTheme.tertiary)};
      margin-bottom: 4px;
      ${theme.fonts.body1};
    }

    .tooltip-body {
      display: flex;
      width: 100%;
      height: 100%;
      padding: 6px 10px;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      background-color: ${({ theme }) => theme.colors.dimmed50};
      color: ${({ light }) => (light ? theme.lightTheme.primary : theme.darkTheme.primary)};
      ${theme.fonts.p4};

      span {
        line-height: 24px;
      }
    }
  }
`;
