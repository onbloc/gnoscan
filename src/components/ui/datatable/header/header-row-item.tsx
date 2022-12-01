import React from 'react';
import styled from 'styled-components';
import {Tooltip} from '../../tooltip';
import {Header} from './header';
import IconTooltip from '@/assets/svgs/icon-tooltip.svg';
import {DatatableOption} from '..';
import theme from '@/styles/theme';

interface Props<T> {
  header: Header<T>;
}

export const HeaderRowItem = <T extends {[key in string]: any}>({header}: Props<T>) => {
  const renderTooltip = () => {
    return (
      header.tooltip && (
        <div className="tooltip-wrapper">
          <Tooltip content={header.tooltip}>
            <IconTooltip />
          </Tooltip>
        </div>
      )
    );
  };

  return (
    <ItemContainer options={DatatableOption.headerOptionByHeader(header)}>
      <div className="content">{header.name}</div>

      {renderTooltip()}
    </ItemContainer>
  );
};

const ItemContainer = styled(DatatableOption.ColumnOption)`
  & {
    ${theme.fonts.p4};
    font-weight: 600;
    justify-content: ${({options}) => options.headerAlign};
    .tooltip-wrapper {
      display: flex;
      flex: 0 0 auto;
      width: 32px;
      height: 16px;
      justify-content: center;
      align-items: center;
    }
  }
`;
