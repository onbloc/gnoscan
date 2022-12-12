import Text from '@/components/ui/text';
import IconTokenDefault from '@/assets/svgs/icon-token-default.svg';
import React from 'react';
import styled from 'styled-components';

interface Props {
  token: string | undefined;
  imagePath: string | undefined;
  name: string | undefined;
  denom: string;
}

export const TokenTitle = ({name, denom}: Props) => {
  return (
    <a href={`/tokens/${denom}`} target={'_blank'} rel={'noopener noreferrer'}>
      <TokenTitleWrapper>
        <IconTokenDefault />
        <Text type="p4">{`${name} (${denom})`}</Text>
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

    svg {
      margin-right: 10px;

      circle {
        fill: ${({theme}) => theme.colors.primary};
      }

      path {
        fill: ${({theme}) => theme.colors.base};
      }
    }
  }
`;
