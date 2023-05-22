import {textEllipsis} from '@/common/utils/string-util';
import Tooltip from '@/components/ui/tooltip';
import React from 'react';
import styled from 'styled-components';

interface Props {
  publisher: string | undefined;
  publisherUsername: string | undefined;
}

export const Owner = ({publisher, publisherUsername}: Props) => {
  const renderTooltip = () => {
    return <TooltipWrapper>{publisher}</TooltipWrapper>;
  };

  const getDisplayUsername = (publisher?: string | undefined) => {
    if (publisherUsername) {
      return publisherUsername;
    }

    if (publisher && publisher.length > 0) {
      return textEllipsis(publisher ?? '', 8);
    }

    return '-';
  };

  return (
    <Container>
      {publisher && publisher !== 'genesis' ? (
        <Tooltip content={renderTooltip()}>
          <OwnerLink href={`/accounts/${publisher}`} target={'_blank'} rel={'noopener noreferrer'}>
            <OwnerText>{getDisplayUsername(publisher)}</OwnerText>
          </OwnerLink>
        </Tooltip>
      ) : (
        <OwnerText className="genesisT-type">{getDisplayUsername()}</OwnerText>
      )}
    </Container>
  );
};

const Container = styled.div`
  &,
  & * {
    width: 100%;
  }
`;

const OwnerLink = styled.a`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({theme}) => theme.colors.blue};
`;

const OwnerText = styled.span`
  width: 100%;
  &.genesisT-type {
    color: ${({theme}) => theme.colors.reverse};
  }
`;

const TooltipWrapper = styled.span`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  justify-content: center;
  align-items: center;
  word-break: keep-all;
  white-space: nowrap;
`;
