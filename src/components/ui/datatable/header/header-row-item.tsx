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
  const tooltipWrapperRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{left: string; top: string}>({
    left: '0',
    top: '0',
  });

  useEffect(() => {
    if (tooltipWrapperRef.current) {
      updateTooltipPosition();
      window.addEventListener('resize', updateTooltipPosition);
      window.addEventListener('scroll', updateTooltipPosition);
    }
    return () => {
      window?.removeEventListener('resize', updateTooltipPosition);
      window?.removeEventListener('scroll', updateTooltipPosition);
    };
  }, [tooltipWrapperRef.current?.getBoundingClientRect().y]);

  const updateTooltipPosition = () => {
    const rect = tooltipWrapperRef.current?.getBoundingClientRect();
    const childRect = tooltipWrapperRef.current?.children
      .item(0)
      ?.children.item(1)
      ?.getBoundingClientRect();
    if (!rect || !childRect) {
      return;
    }
    const positionX = rect.x + 16;
    const positionY = rect.y - childRect.height - 10;
    setTooltipPosition({
      left: `${positionX ?? 0}px`,
      top: `${positionY ?? 0}px`,
    });
  };

  const renderTooltip = () => {
    return (
      header.tooltip && (
        <div ref={tooltipWrapperRef} className="tooltip-wrapper">
          <Tooltip content={header.tooltip}>
            <IconTooltip />
          </Tooltip>
        </div>
      )
    );
  };

  const handleSortOption = () => {
    let changedSortOption = {
      field: header.key,
      order: 'desc',
    };

    if (sortOption?.order === 'desc') {
      changedSortOption.order = 'asc';
    } else if (sortOption?.order === 'asc') {
      changedSortOption.field = 'none';
      changedSortOption.order = 'none';
    }

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
    <ItemContainer {...tooltipPosition} options={DatatableOption.headerOptionByHeader(header)}>
      <div className="content">{header.name}</div>
      {renderSort()}
      {renderTooltip()}
    </ItemContainer>
  );
};

const ItemContainer = styled(DatatableOption.ColumnOption)<{left: string; top: string}>`
  & {
    ${theme.fonts.p4};
    font-weight: 400;
    color: ${({theme}) => theme.colors.tertiary};
    justify-content: ${({options}) => options.headerAlign};

    .tooltip-wrapper {
      position: inherit;
      display: flex;
      flex: 0 0 auto;
      width: 32px;
      height: 16px;
      justify-content: center;
      align-items: center;
    }

    .tooltip {
      position: fixed;
      width: fit-content;
      height: fit-content;
      left: ${({left}) => left};
      top: ${({top}) => top};
      transition: none !important;

      b {
        font-weight: 600;
      }
    }
  }
`;

const getSortIconColor = (active: boolean, order: string, theme: any) => {
  if (active && order) {
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
      fill: ${({active, order, theme}) => getSortIconColor(active, order, theme)};
    }

    .down {
      fill: ${({active, order, theme}) => getSortIconColor(active, order, theme)};
    }
  }
`;
