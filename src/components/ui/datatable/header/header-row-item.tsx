import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Header} from './header';
import IconTooltip from '@/assets/svgs/icon-tooltip.svg';
import IconSortDown from '@/assets/svgs/icon-sort-down.svg';
import IconSortUp from '@/assets/svgs/icon-sort-up.svg';
import {DatatableOption} from '..';
import Tooltip from '../../tooltip';
import theme from '@/styles/theme';

interface Props<T> {
  header: Header<T>;
  sortOption?: {field: string; order: string};
  setSortOption?: (sortOption: {field: string; order: string}) => void;
}

export const HeaderRowItem = <T extends {[key in string]: any}>({
  header,
  sortOption,
  setSortOption,
}: Props<T>) => {
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

  const getChangedSortOption = () => {
    const changedSortOption = {
      field: header.key,
      order: 'desc',
    };

    if (sortOption?.field !== header.key) {
      return changedSortOption;
    }

    if (sortOption?.order === 'desc') {
      return {
        ...changedSortOption,
        order: 'asc',
      };
    }

    if (sortOption?.order === 'asc') {
      return {
        field: 'none',
        order: 'none',
      };
    }

    return changedSortOption;
  };

  const handleSortOption = () => {
    const changedSortOption = getChangedSortOption();
    setSortOption && setSortOption(changedSortOption);
  };

  const renderSort = () => {
    return (
      header.sort && (
        <SortContainer
          active={header.key === sortOption?.field}
          order={sortOption?.order ?? ''}
          onClick={handleSortOption}>
          <IconSortUp className={'up'} />
          <IconSortDown className={'down'} />
        </SortContainer>
      )
    );
  };

  return (
    <ItemContainer options={DatatableOption.headerOptionByHeader(header)}>
      <div className="content">{header.name}</div>
      {renderSort()}
      {renderTooltip()}
    </ItemContainer>
  );
};

const ItemContainer = styled(DatatableOption.ColumnOption)`
  & {
    ${theme.fonts.p4};
    font-weight: 400;
    color: ${({theme}) => theme.colors.tertiary};
    justify-content: ${({options}) => options.headerAlign};
    max-width: ${({options}) => options.width};
    .tooltip-wrapper {
      position: inherit;
      display: flex;
      flex: 0 0 auto;
      width: 32px;
      height: 16px;
      justify-content: center;
      align-items: center;

      svg {
        fill: ${({theme}) => theme.colors.tertiary};
        & .icon-tooltip_svg__bg {
          fill: ${({theme}) => theme.colors.surface};
        }
      }
    }
  }
`;

const getSortIconColor = (active: boolean, order: string, expectedOrder: string, theme: any) => {
  if (active && order === expectedOrder) {
    return theme?.colors?.blue ?? '';
  }
  return theme?.colors?.pantone ?? '';
};

const SortContainer = styled.div<{active: boolean; order: string}>`
  & {
    display: flex;
    flex-direction: column;
    width: 24px;
    height: auto;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    ${theme.fonts.p4};

    .up {
      fill: ${({active, order, theme}) => getSortIconColor(active, order, 'asc', theme)};
    }

    .down {
      fill: ${({active, order, theme}) => getSortIconColor(active, order, 'desc', theme)};
    }
  }
`;
