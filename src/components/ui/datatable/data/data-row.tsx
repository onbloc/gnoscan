import React from 'react';
import styled from 'styled-components';
import {DatatableHeader} from '..';
import {DataRowItem} from './data-row-item';

interface Props<T> {
  headers: Array<DatatableHeader.Header<T>>;
  data: T;
}

export const DataRow = <T extends {[key in string]: any}>({headers, data}: Props<T>) => {
  return (
    <DataRowContainer>
      {headers.map((header, index) => (
        <DataRowItem key={index} header={header} data={data} className={header.itemClassName} />
      ))}
    </DataRowContainer>
  );
};

const DataRowContainer = styled.div`
  & {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
    border-bottom: 1px solid ${({theme}) => theme.colors.dimmed50};
    align-items: center;
  }
`;
