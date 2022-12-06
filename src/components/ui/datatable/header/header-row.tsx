import React from 'react';
import styled from 'styled-components';
import {Header} from './header';
import {HeaderRowItem} from './header-row-item';

interface Props<T> {
  headers: Array<Header<T>>;
  sortOption?: {field: string; order: string};
  setSortOption?: (sortOption: {field: string; order: string}) => void;
}

export const HeaderRow = <T extends {[key in string]: any}>({
  headers,
  sortOption,
  setSortOption,
}: Props<T>) => {
  return (
    <HeaderRowContainer>
      {headers.map((header, index) => (
        <HeaderRowItem
          key={index}
          header={header}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
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
