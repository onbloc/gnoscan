import React from 'react';
import styled from 'styled-components';
import {DatatableHeader} from '..';
import {DataRow} from './data-row';

interface Props {
  headers: Array<DatatableHeader.Header>;
  datas: Array<{[key in string]: any}>;
}

export const DataList = ({headers, datas}: Props) => {
  return (
    <DataListContainer>
      {datas.map(data => (
        <DataRow headers={headers} data={data} />
      ))}
    </DataListContainer>
  );
};

const DataListContainer = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    border-bottom: 1px solid ${({theme}) => theme.colors.dimmed50};
  }
`;
