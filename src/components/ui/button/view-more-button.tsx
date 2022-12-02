import React from 'react';
import styled from 'styled-components';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import {eachMedia} from '@/common/hooks/use-media';
import {Button} from './button';

interface ViewMoreButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const ViewMoreButton = ({onClick, disabled}: ViewMoreButtonProps) => {
  const media = eachMedia();
  return (
    <Wrapper
      onClick={onClick}
      disabled={disabled}
      width={media === 'desktop' ? '344px' : '100%'}
      height="52px">
      <Text type="h7" color="reverse">
        View More Transactions
      </Text>
    </Wrapper>
  );
};

const Wrapper = styled(Button)`
  ${mixins.flexbox('row', 'center', 'center')};
  border-radius: 4px;
  background-color: ${({theme}) => theme.colors.surface};
  margin: 32px auto 0px;
  /* transition: background-color 0.4s ease; */
  /* :hover:not(:disabled) {
    background-color: ${({theme}) => theme.colors.reverse};
  } */
  :disabled {
    opacity: 0.6;
    color: ${({theme}) => theme.colors.dimmed200};
  }
`;
