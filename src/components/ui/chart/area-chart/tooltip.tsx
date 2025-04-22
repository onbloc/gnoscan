import React from "react";
import { ActiveElement } from "chart.js";
import styled from "styled-components";
import theme from "@/styles/theme";
import BigNumber from "bignumber.js";
import { makeAreaGraphDisplayLabel } from "./area-chart";

interface TooltipProps {
  activeElements: Array<ActiveElement>;
  title: string;
  datas: { [key in string]: Array<{ value: number; rate: number }> };
  chartColors: Array<string>;
  themeMode: string;
}

export const AreaChartTooltip = ({ title, activeElements, datas, themeMode, chartColors }: TooltipProps) => {
  const getTotalValue = () => {
    if (activeElements.length === 0) {
      return 0;
    }
    try {
      const totalValue = Object.keys(datas).reduce(
        (d1, d2) => d1.plus(BigNumber(datas[d2][activeElements[0].index].value)),
        BigNumber(0),
      );
      const { integer, decimal } = parseValue(totalValue.toNumber());
      return (
        <>
          <strong>{integer}</strong>
          {decimal ? `.${decimal}` : ""}
        </>
      );
    } catch (e) {}
    return (
      <>
        <strong>{0}</strong>
      </>
    );
  };

  const getTotalRate = () => {
    if (activeElements.length === 0) {
      return 0;
    }
    try {
      const totalRate = Object.keys(datas).reduce((d1, d2) => d1 + datas[d2][activeElements[0].index].rate, 0);
      return `${Math.round(totalRate)}%`;
    } catch (e) {}
    return "0%";
  };

  const parseValue = (value: number) => {
    const integer = "0";
    const decimal = "0";
    const valueStr = `${value}`;

    try {
      const dotIndex = valueStr.indexOf(".");
      if (dotIndex < 0) {
        return {
          integer: valueStr,
          decimal: "",
        };
      }

      return {
        integer: valueStr.substring(0, dotIndex),
        decimal: valueStr.substring(dotIndex + 1, valueStr.length),
      };
    } catch (e) {}

    return {
      integer,
      decimal,
    };
  };

  const renderRow = (packagePath: string, cIndex: number) => {
    if (activeElements.length === 0) {
      return <></>;
    }
    const data = datas[packagePath][activeElements[0].index];
    const { integer, decimal } = parseValue(data?.value || 0);
    return (
      <div key={cIndex} className="tooltip-row">
        <span className="dot" style={{ backgroundColor: `${chartColors[cIndex] ?? "#000000"}` }}></span>
        <span className="title">{makeAreaGraphDisplayLabel(packagePath)}</span>
        <span className="value">
          <strong>{integer}</strong>
          {decimal ? `.${decimal}` : ""}
        </span>
        <span className="rate">{`${Math.round(data?.rate || 0)}%`}</span>
      </div>
    );
  };

  return activeElements.length > 0 ? (
    <TooltipContainer light={themeMode === "light"}>
      <p className="tooltip-title">{title}</p>
      <div className="tooltip-header">
        <span className="title">{"Total:"}</span>
        <span className="value">{getTotalValue()}</span>
        <span className="rate">{getTotalRate()}</span>
      </div>
      <div className="tooltip-body">{Object.keys(datas).map(renderRow)}</div>
    </TooltipContainer>
  ) : (
    <></>
  );
};

const TooltipContainer = styled.div<{ light: boolean }>`
  & {
    display: flex;
    flex-direction: column;
    min-width: 260px;
    background-color: ${({ light }) => (light ? theme.lightTheme.base : theme.darkTheme.base)};
    padding: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;

    span {
      display: inline-flex;
      ${theme.fonts.body1};
      color: ${({ light }) => (light ? theme.lightTheme.primary : theme.darkTheme.primary)};
      vertical-align: bottom;
    }

    .title {
      display: flex;
      width: 100%;
      margin-bottom: 0;
    }

    .value {
      display: flex;
      flex-direction: row;
      flex-shrink: 0;
      width: 90px;
      font-size: 10px;
      justify-content: center;

      strong {
        font-weight: 600;
        font-size: 12px;
      }
    }

    .rate {
      display: flex;
      flex-shrink: 0;
      width: 40px;
      justify-content: flex-end;
    }
  }

  & .tooltip-title {
    display: flex;
    width: 100%;
    color: ${({ light }) => (light ? theme.lightTheme.tertiary : theme.darkTheme.tertiary)};
    padding-bottom: 4px;
    ${theme.fonts.body1};
  }

  & .tooltip-header {
    display: flex;
    width: 100%;
    padding: 4px 0;
    border-bottom: 1px solid ${({ light }) => (light ? theme.lightTheme.dimmed100 : theme.darkTheme.dimmed100)};
    line-height: 20px;

    span {
      ${theme.fonts.p4};
    }

    .value {
      font-size: 12px;

      strong {
        font-weight: 600;
        font-size: 14px;
      }
    }
  }

  & .tooltip-body {
    display: flex;
    flex-direction: column;
    width: 100%;
    line-height: 16px;

    .tooltip-row {
      display: flex;
      padding: 3px 0;
      width: 100%;
      align-items: center;

      span {
        display: inline-flex;
      }

      .value {
        font-size: 10px;
        line-height: 20px;

        strong {
          font-weight: 600;
          font-size: 12px;
          line-height: 18px;
        }
      }

      .dot {
        display: inline-flex;
        flex-shrink: 0;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        margin-right: 8px;
      }
    }
  }
`;
