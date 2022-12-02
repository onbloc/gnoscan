import {Tooltip} from '@/components/ui/tooltip';
import React from 'react';
import styled from 'styled-components';

interface Props {
  type: string;
  func: string;
}

export const Type = ({type, func}: Props) => {
  return (
    <TypeWrapper>
      <Tooltip content={type}>
        <span>{func}</span>
      </Tooltip>
    </TypeWrapper>
  );
};

const TypeWrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    height: auto;
    justify-content: center;
    align-items: center;

    span {
      display: flex;
      padding: 4px 16px;
      font-weight: 600;
      color: #fff;
      background-color: ${({theme}) => theme.colors.blue};
      border-radius: 4px;
    }
  }
`;
