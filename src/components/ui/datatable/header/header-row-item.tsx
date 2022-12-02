import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Header} from './header';
import IconTooltip from '@/assets/svgs/icon-tooltip.svg';
import {DatatableOption} from '..';
import theme from '@/styles/theme';
import Tooltip from '../../tooltip';

interface Props<T> {
  header: Header<T>;
}

export const HeaderRowItem = <T extends {[key in string]: any}>({header}: Props<T>) => {
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

  return (
    <ItemContainer {...tooltipPosition} options={DatatableOption.headerOptionByHeader(header)}>
      <div className="content">{header.name}</div>

      {renderTooltip()}
    </ItemContainer>
  );
};

const ItemContainer = styled(DatatableOption.ColumnOption)<{left: string; top: string}>`
  & {
    ${theme.fonts.p4};
    font-weight: 600;
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

      b {
        font-weight: 600;
      }
    }
  }
`;
