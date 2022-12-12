import React, {useState, useCallback, useEffect, useRef} from 'react';
import styled, {css} from 'styled-components';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import {usePopper} from 'react-popper';
import {Tooltip as ReactTooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

type TriggerType = 'click' | 'hover';
interface TooltipProps {
  className?: string;
  children: React.ReactNode;
  content: React.ReactNode | string;
  trigger?: TriggerType;
  width?: number;
  copyText?: string;
  contentWidth?: string;
  selector?: string;
}

interface StyleProps {
  ref?: any;
  trigger?: TriggerType;
  isClicked?: boolean;
  width?: number;
}

const Tooltip = ({
  className,
  children,
  content,
  trigger = 'hover',
  width,
  copyText = '',
  selector = '',
}: TooltipProps) => {
  return (
    <Wrap className="tooltip-wrapper">
      <div id="tooltip-anchor-data-html" data-tooltip-content={content}>
        {children}
      </div>

      <ReactTooltip
        anchorId="tooltip-anchor-data-html"
        className="tooltip-content"
        place="top"
        data-tooltip-position-strategy="fixed"
        classNameArrow="tooltip-arrow"
      />
    </Wrap>
  );
};

const Wrap = styled.div`
  &.tooltip-wrapper {
    .tooltip-content,
    .tooltip-arrow {
      background-color: ${({theme}) => theme.colors.base};
      opacity: 1;
    }
    .tooltip-content {
      color: ${({theme}) => theme.colors.tertiary};
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      word-break: keep-all;
      text-align: center;
    }
  }
`;

export default Tooltip;
