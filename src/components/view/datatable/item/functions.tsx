import Tooltip from '@/components/ui/tooltip';
import React from 'react';
import styled from 'styled-components';

interface Props {
  functions: Array<string>;
}

export const Functions = ({functions}: Props) => {
  const renderItems = () => {
    return (
      <>
        {functions.map((func, index) => (
          <span key={index}>{func}</span>
        ))}
      </>
    );
  };

  const renderOverflowItems = () => {
    return (
      <>
        {functions.slice(0, 3).map((func, index) => (
          <span key={index}>{func}</span>
        ))}
        ...
      </>
    );
  };

  return (
    <FunctionsWrapper>
      {functions.length > 3 ? renderOverflowItems() : renderItems()}
    </FunctionsWrapper>
  );
};

const FunctionsWrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    height: auto;
    justify-content: flex-start;
    align-items: center;

    span {
      display: flex;
      padding: 4px 16px;
      font-weight: 600;
      color: #fff;
      background-color: ${({theme}) => theme.colors.blue};
      border-radius: 4px;
      margin: 0 4px;
    }
  }
`;
