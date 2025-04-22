/* eslint-disable @typescript-eslint/no-explicit-any */ import React from "react";
import styled from "styled-components";
import { DatatableHeader } from "..";
import { DataRow } from "./data-row";

interface Props<T> {
  headers: Array<DatatableHeader.Header<T>>;
  datas: Array<T>;
  renderDetails?: (data: T) => React.ReactNode;
}

export const DataList = <T extends { [key in string]: any }>({ headers, datas, renderDetails }: Props<T>) => {
  return (
    <DataListContainer>
      {datas.map((data, index) => (
        <DataRow key={index} headers={headers} data={data} renderDetails={renderDetails} />
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
    border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed50};
  }
`;
