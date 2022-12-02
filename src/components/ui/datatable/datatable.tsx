import React from 'react';
import styled from 'styled-components';
import {DatatableData, DatatableHeader} from '.';

interface Props<T> {
  headers: Array<DatatableHeader.Header<T>>;
  datas: Array<T>;
}

export const Datatable = <T extends {[key in string]: any}>({headers, datas}: Props<T>) => {
  return (
    <Container>
      <div className="scroll-wrapper">
        <DatatableHeader.HeaderRow headers={headers} />
        <DatatableData.DataList headers={headers} datas={datas} />
      </div>
    </Container>
  );
};

const Container = styled.div`
  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  & {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    padding: 20px;
    background-color: ${({theme}) => theme.colors.base};
    border-radius: 10px;
    overflow-x: auto;

    .scroll-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 1150px;
      z-index: 5;
    }
  }
`;
