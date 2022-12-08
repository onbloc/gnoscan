'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import Link from 'next/link';
import {getDateDiff} from '@/common/utils/date-util';
import usePageQuery from '@/common/hooks/use-page-query';
import {DatatableItem} from '..';
import {numberWithCommas} from '@/common/utils';
import useLoading from '@/common/hooks/use-loading';

const PADDING = 32;

interface BlockData {
  block_hash: string;
  height: number;
  time: string;
  tx_count: number;
  proposer: string;
  total_fees: number;
}

export const BlockDatatable = () => {
  const [theme] = useTheme();
  const {data, finished} = usePageQuery<Array<BlockData>>({
    key: 'block/block-list',
    uri: 'http://3.218.133.250:7677/latest/list/blocks',
    pageable: true,
  });
  useLoading({finished});

  const getBlocks = (): Array<BlockData> => {
    if (!data) {
      return [];
    }
    return data.pages.reduce((accum: Array<BlockData>, current) => {
      return [...accum, ...current];
    }, []);
  };

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
    return DatatableOption.Builder.builder<BlockData>()
      .key('block_hash')
      .name('Block Hash')
      .width(211 + PADDING)
      .colorName('blue')
      .renderOption((_, data) => (
        <DatatableItem.BlockHash hash={data.block_hash} height={data.height} />
      ))
      .build();
  };

  const createHeaderHeight = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('height')
      .name('Height')
      .width(89 + PADDING)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('time')
      .name('Time')
      .width(194 + PADDING)
      .renderOption(value => `${getDateDiff(value)}`)
      .build();
  };

  const createHeaderTxCount = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('tx_count')
      .name('Tx Count')
      .width(`${134 + PADDING}px`)
      .renderOption(numberWithCommas)
      .build();
  };

  const createHeaderProposer = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('proposer')
      .name('Proposer')
      .width(194 + PADDING)
      .colorName('blue')
      .renderOption(proposer => (
        <span className="ellipsis">
          <Link href={`/accounts/${proposer}`}>{proposer}</Link>
        </span>
      ))
      .build();
  };

  const createHeaderTotalFees = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('total_fees')
      .name('Total Fees')
      .width(131 + PADDING)
      .renderOption(tatalFees => <DatatableItem.Amount value={tatalFees} denom={'ugnot'} />)
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
      datas={getBlocks()}
    />
  );
};
