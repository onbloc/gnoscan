import React from 'react';
import styled from 'styled-components';
import {DatatableHeader} from '..';
import {DataRowItem} from './data-row-item';

interface Props<T> {
  headers: Array<DatatableHeader.Header<T>>;
  data: T;
  renderDetails?: (data: T) => React.ReactNode;
}

export const DataRow = <T extends {[key in string]: any}>({
  headers,
  data,
  renderDetails,
}: Props<T>) => {
  return (
    <DataRowContainer>
      <div className="row">
        {headers.map((header, index) => (
          <DataRowItem key={index} header={header} data={data} className={header.itemClassName} />
        ))}
      </div>

      {renderDetails && <div className="details">{renderDetails(data)}</div>}
    </DataRowContainer>
  );
};

const DataRowContainer = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    border-bottom: 1px solid ${({theme}) => theme.colors.dimmed50};
    align-items: center;

    .row {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: auto;
      align-items: center;
    }

    .details {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: auto;
      align-items: center;
    }
  }
`;
