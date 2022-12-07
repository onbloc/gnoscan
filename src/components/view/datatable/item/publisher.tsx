import {textEllipsis} from '@/common/utils/string-util';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

interface Props {
  username: string | undefined;
  address: string | undefined;
}

export const Publisher = ({username, address}: Props) => {
  const getDisplayUsername = (address?: string | undefined) => {
    if (username) {
      return username;
    }

    if (address && address.length > 0) {
      return textEllipsis(address ?? '', 8);
    }

    return '-';
  };

  return (
    <PublisherWrapper className="ellipsis">
      {address ? (
        <Link href={`/accounts/${address}`}>{getDisplayUsername(address)}</Link>
      ) : (
        getDisplayUsername()
      )}
    </PublisherWrapper>
  );
};

const PublisherWrapper = styled.span`
  & a {
    color: ${({theme}) => theme.colors.blue};
  }
`;
