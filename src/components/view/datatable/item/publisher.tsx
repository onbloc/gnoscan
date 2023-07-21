import {textEllipsis} from '@/common/utils/string-util';
import Tooltip from '@/components/ui/tooltip';
import React from 'react';
import styled from 'styled-components';

interface Props {
  username: string | undefined;
  address: string | undefined;
}

export const Publisher = ({username, address}: Props) => {
  const renderTooltip = () => {
    return <TooltipWrapper>{address}</TooltipWrapper>;
  };

  const getDisplayUsername = (address?: string | undefined) => {
    if (username) {
      return username;
    }

    if (address && address.length > 0) {
      return textEllipsis(address ?? '', 8);
    }

    return '-';
  };

  return address && address !== 'genesis' ? (
    <Tooltip content={renderTooltip()}>
      <PublisherLink className="ellipsis" href={`/accounts/${address}`}>
        {getDisplayUsername(address)}
      </PublisherLink>
    </Tooltip>
  ) : (
    <>{getDisplayUsername()}</>
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
  }
`;

const PublisherLink = styled.a`
  max-width: 128px;
`;
