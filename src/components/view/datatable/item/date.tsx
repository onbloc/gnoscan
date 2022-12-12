import {getDateDiff, getLocalDateString} from '@/common/utils/date-util';
import Tooltip from '@/components/ui/tooltip';
import React from 'react';
import styled from 'styled-components';

interface Props {
  date: string;
}

export const Date = ({date}: Props) => {
  const renderTooltip = () => {
    return <TooltipWrapper>{getLocalDateString(date)}</TooltipWrapper>;
  };

  return (
    <DateWrapper>
      <Tooltip content={renderTooltip()}>{getDateDiff(date ?? '')}</Tooltip>
    </DateWrapper>
  );
};

const DateWrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    height: auto;
    justify-content: center;
    align-items: center;
  }
`;

const TooltipWrapper = styled.span`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;
    word-break: keep-all;
    white-space: nowrap;
  }
`;
