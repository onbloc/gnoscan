import mixins from '@/styles/mixins';
import React from 'react';
import styled from 'styled-components';
import {Button} from '../button';

interface GhostButtonsProps {
  left: string;
  right: string;
  className?: string;
}

const GhostBtnWrap = styled.div`
  ${mixins.flexbox('row', 'center', 'space-between')};
  width: 100%;
  gap: 10px;
`;

const GhostBtn = styled(Button)`
  transition: all 0.4s ease;
  :disabled {
    border: none;
  }
`;

export const GhostButtons = ({left, right, className}: GhostButtonsProps) => {
  return (
    <GhostBtnWrap className={className}>
      <GhostBtn fullWidth height="48px" disabled>
        {left}
      </GhostBtn>
      <GhostBtn fullWidth height="48px" disabled>
        {right}
      </GhostBtn>
    </GhostBtnWrap>
  );
};
