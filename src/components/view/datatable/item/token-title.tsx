import Text from '@/components/ui/text';
import UnknownToken from '@/assets/svgs/icon-unknown-token.svg';
import React from 'react';
import styled from 'styled-components';

interface Props {
  token: string | undefined;
  imagePath: string | undefined;
  name: string | undefined;
  symbol: string;
  pkgPath: string;
}

export const TokenTitle = ({name, symbol, pkgPath, imagePath}: Props) => {
  return (
    <a href={`/tokens/${pkgPath}`}>
      <TokenTitleWrapper>
        {imagePath && imagePath !== '' ? (
          <img className="token" src={imagePath} alt="token logo" />
        ) : (
          <div className="unknown-token">
            <UnknownToken width="20" height="20" />
          </div>
        )}

        <Text type="p4">{`${name} (${symbol})`}</Text>
      </TokenTitleWrapper>
    </a>
  );
};

const TokenTitleWrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    height: auto;
    justify-content: center;
    align-items: center;
    color: ${({theme}) => theme.colors.blue};
    cursor: pointer;

    .token,
    .unknown-token {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
`;
