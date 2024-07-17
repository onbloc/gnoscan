import {useGetBlockTimeQuery} from '@/common/react-query/block';
import {getDateDiff, getLocalDateString} from '@/common/utils/date-util';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import Tooltip from '@/components/ui/tooltip';
import React, {useMemo} from 'react';
import styled from 'styled-components';

interface Props {
  blockHeight: number;
}

export const LazyDate = ({blockHeight}: Props) => {
  const {data: blockTime, isFetched} = useGetBlockTimeQuery(blockHeight);

  const date = useMemo(() => {
    if (!isFetched) {
      return null;
    }
    return blockTime || null;
  }, [blockTime, isFetched]);

  const renderTooltip = () => {
    return <TooltipWrapper>{getLocalDateString(date)}</TooltipWrapper>;
  };

  if (!isFetched || !date) {
    return <SkeletonBar height={'20px'} />;
  }

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
