'use client';

import React from 'react';
import Datatable, {DatatableHeader} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import Link from 'next/link';
import {getDateDiff} from '@/common/utils/date-util';
import {textEllipsis} from '@/common/utils/string-util';

const PADDING = 32;

const BlockDatatable = <T extends {[key in string]: any}>({datas}: {datas: Array<T>}) => {
  const [theme] = useTheme();

  const createHeaders = (): Array<DatatableHeader.Header<T>> => [
    {
      key: 'block_hash',
      name: 'Block Hash',
      width: `${211 + PADDING}px`,
      colorName: 'blue',
      renderOption: (value, data) => (
        <Link href={`/blocks/${data.block_hash}`}>{textEllipsis(value, 8)}</Link>
      ),
    },
    {
      key: 'height',
      name: 'Height',
      width: `${89 + PADDING}px`,
      colorName: 'blue',
      renderOption: (value, data) => <Link href={`/blocks/${data.block_hash}`}>{value}</Link>,
    },
    {
      key: 'time',
      name: 'Time',
      width: `${194 + PADDING}px`,
      renderOption: value => `${getDateDiff(value)}`,
    },
    {
      key: 'tx_count',
      name: 'Tx Count',
      width: `${134 + PADDING}px`,
    },
    {
      key: 'proposer',
      name: 'Proposer',
      width: `${194 + PADDING}px`,
      colorName: 'blue',
      renderOption: (value, data) => <Link href={`/blocks/${data.block_hash}`}>{value}</Link>,
    },
    {
      key: 'total_fees',
      name: 'Total Fees',
      width: `${131 + PADDING}px`,
      renderOption: value => `${value} GNOT`,
    },
  ];

  return (
    <Datatable
      headers={createHeaders().map(item => {
        return {
          ...item,
          themeMode: theme,
        };
      })}
      datas={datas}
    />
  );
};

export default BlockDatatable;
