'use client';

import React from 'react';
import Datatable, {DatatableHeader, DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import Link from 'next/link';
import {getDateDiff} from '@/common/utils/date-util';
import {textEllipsis} from '@/common/utils/string-util';

const PADDING = 32;

const BlockDatatable = <T extends {[key in string]: any}>({datas}: {datas: Array<T>}) => {
  const [theme] = useTheme();
  console.log(datas);
  const createHeaders = () => {
    return [
      createHeaderBlockHash(),
      createHeaderHeight(),
      createHeaderTime(),
      createHeaderTxCount(),
      createHeaderProposer(),
      createHeaderTotalFees(),
    ];
  };

  const createHeaderBlockHash = () => {
    return DatatableOption.Builder.builder<T>()
      .key('block_hash')
      .name('Block Hash')
      .width(211 + PADDING)
      .colorName('blue')
      .renderOption((value, data) => (
        <span className="ellipsis">
          <Link href={`/blocks/${data.block_hash}`}>{textEllipsis(value, 8)}</Link>
        </span>
      ))
      .build();
  };

  const createHeaderHeight = () => {
    return DatatableOption.Builder.builder<T>()
      .key('height')
      .name('Height')
      .width(89 + PADDING)
      .colorName('blue')
      .renderOption((value, data) => <Link href={`/blocks/${data.block_hash}`}>{value}</Link>)
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<T>()
      .key('time')
      .name('Time')
      .width(194 + PADDING)
      .renderOption(value => `${getDateDiff(value)}`)
      .build();
  };

  const createHeaderTxCount = () => {
    return DatatableOption.Builder.builder<T>()
      .key('tx_count')
      .name('Tx Count')
      .width(`${134 + PADDING}px`)
      .build();
  };

  const createHeaderProposer = () => {
    return DatatableOption.Builder.builder<T>()
      .key('proposer')
      .name('Proposer')
      .width(194 + PADDING)
      .colorName('blue')
      .renderOption((value, data) => (
        <span className="ellipsis">
          <Link href={`/blocks/${data.block_hash}`}>{value}</Link>
        </span>
      ))
      .build();
  };

  const createHeaderTotalFees = () => {
    return DatatableOption.Builder.builder<T>()
      .key('total_fees')
      .name('Total Fees')
      .width(131 + PADDING)
      .renderOption(value => `${value} GNOT`)
      .build();
  };

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
