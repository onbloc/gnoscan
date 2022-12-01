import React from 'react';
import styled from 'styled-components';
import {Header} from './header';
import {HeaderRowItem} from './header-row-item';

interface Props {
  headers: Array<Header>;
}

export const HeaderRow = ({headers}: Props) => {
  return (
    <HeaderRowContainer>
      {headers.map(header => (
        <HeaderRowItem header={header} />
      ))}
    </HeaderRowContainer>
  );
};

const HeaderRowContainer = styled.div`
  & {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    border-bottom: 1px solid ${({theme}) => theme.colors.dimmed50};
  }
`;
