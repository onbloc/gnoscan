import React from 'react';
import styled from 'styled-components';

interface Props {
  funcLength: number;
}

export const Functions = ({funcLength}: Props) => {
  return <FunctionsWrapper>{funcLength}</FunctionsWrapper>;
};

const FunctionsWrapper = styled.span`
  color: ${({theme}) => theme.colors.reverse};
`;
