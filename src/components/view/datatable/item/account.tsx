import {textEllipsis} from '@/common/utils/string-util';
import Tooltip from '@/components/ui/tooltip';
import React from 'react';
import styled from 'styled-components';

interface Props {
  address: string | undefined;
}

export const Account = ({address}: Props) => {
  const renderTooltip = () => {
    return <TooltipWrapper>{address}</TooltipWrapper>;
  };

  return (
    <Tooltip content={renderTooltip()}>
      <a
        className="ellipsis"
        href={`/accounts/${address}`}
        target={'_blank'}
        rel={'noopener noreferrer'}>
        {textEllipsis(address ?? '', 6)}
      </a>
    </Tooltip>
  );
};

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

    .ellipsis {
      max-width: 128px;
    }
  }
`;
