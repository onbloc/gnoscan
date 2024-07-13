import theme from '@/styles/theme';
import React from 'react';
import styled from 'styled-components';
import {DatatableHeader} from '..';
import {DatatableOption} from '..';

interface Props<T> {
  header: DatatableHeader.Header<T>;
  data: T;
  className?: string;
}

export const DataRowItem = <T extends {[key in string]: any}>({
  header,
  data,
  className,
}: Props<T>) => {
  const option = DatatableOption.dataOptionByHeader(header);
  const value = data?.[header.key];

  return (
    <ItemContainer className={className || ''} options={option}>
      {option.renderOption ? (
        option.renderOption(value, data)
      ) : (
        <span className="ellipsis">{`${value}`}</span>
      )}
    </ItemContainer>
  );
};

const ItemContainer = styled(DatatableOption.ColumnOption)`
  & {
    ${theme.fonts.p4};
    width: ${({options}) => options.width};
    max-width: ${({options}) => options.width};
    .tooltip-wrapper {
      display: flex;
      flex: 0 0 auto;
      width: 32px;
      height: 16px;
      justify-content: center;
      align-items: center;
    }

    .link {
      cursor: pointer;
    }
  }
`;
