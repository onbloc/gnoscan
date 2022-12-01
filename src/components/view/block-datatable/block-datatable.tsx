'use client';

import React, {useEffect, useState} from 'react';
import Datatable, {DatatableHeader} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import Link from 'next/link';
import {getDateDiff} from '@/common/utils/date-util';
import {textEllipsis} from '@/common/utils/string-util';

const PADDING = 32;
const HEADER_OPTION: Array<DatatableHeader.Header<Block>> = [
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

interface Block {
  block_hash: string;
  height: number;
  time: string;
  tx_count: number;
  proposer: string;
  total_fees: number;
}

const BlockDatatable = () => {
  const [theme] = useTheme();
  const [blockData, setBlockData] = useState<Array<Block>>([]);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = () => {
    try {
      fetch('http://3.218.133.250:7677/v0/list/blocks')
        .then(res => res.json())
        .then(res => setBlockData(res));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Datatable
      headers={HEADER_OPTION.map(item => {
        return {
          ...item,
          themeMode: theme,
        };
      })}
      datas={blockData}
    />
  );
};

export default BlockDatatable;
