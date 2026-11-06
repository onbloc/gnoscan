import React from "react";
import styled from "styled-components";

import theme from "@/styles/theme";
import { AmountText } from "../../text/amount-text";
import { ChartTooltipContainer } from "../chart-common";

interface TooltipProps {
  title: string;
  // Balance in GNOT, as an exact decimal string
  value: string;
  // Display value of the balance in USD, when the price is known
  usd?: string | null;
  themeMode: string;
}

export const BalanceChartTooltip = ({ themeMode, title, value, usd }: TooltipProps) => {
  const light = themeMode === "light";

  return (
    <TooltipContainer light={light}>
      <p className="tooltip-title">{title}</p>
      <div className="tooltip-amount">
        <AmountText minSize="body1" maxSize="p4" lineHeight="24px" wrap={false} value={value} denom="GNOT" />
        {usd && <span className="tooltip-usd">({usd})</span>}
      </div>
    </TooltipContainer>
  );
};

const TooltipContainer = styled(ChartTooltipContainer)`
  & {
    gap: 4px;
    width: max-content;
    padding: 12px 16px;

    .tooltip-title {
      color: ${({ light }) => (light ? theme.lightTheme.tertiary : theme.darkTheme.tertiary)};
      ${theme.fonts.body1};
    }

    .tooltip-amount {
      display: flex;
      align-items: baseline;
      gap: 4px;
      white-space: nowrap;
      color: ${({ light }) => (light ? theme.lightTheme.primary : theme.darkTheme.primary)};
    }

    .tooltip-usd {
      color: ${({ light }) => (light ? theme.lightTheme.tertiary : theme.darkTheme.tertiary)};
      ${theme.fonts.body1};
    }
  }
`;
