import React, {useEffect, useState} from 'react';
import {TooltipModel} from 'chart.js';
import styled from 'styled-components';
import theme from '@/styles/theme';

interface TooltipProps {
  tooltip: TooltipModel<'line'>;
  datas: {[key in string]: Array<{value: number; rate: number}>};
  themeMode: string;
}

export const AreaChartTooltip = ({tooltip, datas, themeMode}: TooltipProps) => {
  const getTotalValue = () => {
    if (tooltip.getActiveElements().length === 0) {
      return 0;
    }
    const totalValue = Object.keys(datas).reduce(
      (d1, d2) => d1 + datas[d2][tooltip.getActiveElements()[0].index].value,
      0,
    );
    const {integer, decimal} = parseValue(totalValue);
    return (
      <>
        <strong>{integer}</strong>
        {`.${decimal}`}
      </>
    );
  };

  const getTotalRate = () => {
    if (tooltip.getActiveElements().length === 0) {
      return 0;
    }
    const totalRate = Object.keys(datas).reduce(
      (d1, d2) => d1 + datas[d2][tooltip.getActiveElements()[0].index].rate,
      0,
    );
    return `${Math.round(totalRate)}%`;
  };

  const parseValue = (value: number) => {
    let integer = '0';
    let decimal = '0';

    try {
      if (value > 0) {
        decimal = `000000${value}`.slice(-6);
        if (`${value}`.length > 6) {
          integer = `${value}`.slice(0, `${value}`.length - 6);
          decimal = `${value}`.slice(-6);
        }
      }
    } catch (e) {}

    return {
      integer,
      decimal,
    };
  };

  const renderRow = (packagePath: string, cIndex: number) => {
    if (tooltip.getActiveElements().length === 0) {
      return <></>;
    }
    const data = datas[packagePath][tooltip.getActiveElements()[0].index];
    const {integer, decimal} = parseValue(data.value);
    return (
      <div key={cIndex} className="tooltip-row">
        <span className="dot"></span>
        <span className="title">{packagePath}</span>
        <span className="value">
          <strong>{integer}</strong>
          {`.${decimal}`}
        </span>
        <span className="rate">{`${Math.round(data.rate)}%`}</span>
      </div>
    );
  };

  return tooltip.getActiveElements().length > 0 ? (
    <TooltipContainer light={themeMode === 'light'}>
      <p className="tooltip-title">{tooltip.title}</p>
      <div className="tooltip-header">
        <span className="title">{'Total:'}</span>
        <span className="value">{getTotalValue()}</span>
        <span className="rate">{getTotalRate()}</span>
      </div>
      <div className="tooltip-body">{Object.keys(datas).map(renderRow)}</div>
    </TooltipContainer>
  ) : (
    <></>
  );
};

const TooltipContainer = styled.div<{light: boolean}>`
  & {
    display: flex;
    flex-direction: column;
    width: 260px;
    background-color: ${({light}) => (light ? theme.lightTheme.base : theme.darkTheme.base)};
    padding: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;

    span {
      display: inline-flex;
      ${theme.fonts.body1};
      color: ${({light}) => (light ? theme.lightTheme.primary : theme.darkTheme.primary)};
      vertical-align: bottom;
    }

    .title {
      width: 90px;
    }

    .value {
      width: 90px;
      justify-content: flex-end;
      font-size: 10px;

      strong {
        font-weight: 600;
        font-size: 12px;
      }
    }

    .rate {
      width: 40px;
      justify-content: flex-end;
    }
  }

  & .tooltip-title {
    display: flex;
    width: 100%;
    color: ${({light}) => (light ? theme.lightTheme.tertiary : theme.darkTheme.tertiary)};
    padding-bottom: 4px;
    ${theme.fonts.body1};
  }

  & .tooltip-header {
    display: flex;
    width: 100%;
    padding: 4px 0;
    border-bottom: 1px solid
      ${({light}) => (light ? theme.lightTheme.dimmed100 : theme.darkTheme.dimmed100)};
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
      padding: 3px 0;
    }
  }
`;
