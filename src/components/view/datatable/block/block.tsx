'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import Link from 'next/link';
import usePageQuery from '@/common/hooks/use-page-query';
import {DatatableItem} from '..';
import {numberWithCommas} from '@/common/utils';
import useLoading from '@/common/hooks/use-loading';
import {API_URI} from '@/common/values/constant-value';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';

const PADDING = 32;

interface BlockData {
  block_hash: string;
  height: number;
  time: string;
  tx_count: number;
  proposer: string;
  username?: string;
  total_fees: number;
}

export const BlockDatatable = () => {
  const themeMode = useRecoilValue(themeState);
  const {data, finished} = usePageQuery<Array<BlockData>>({
    key: 'block/block-list',
    uri: API_URI + '/latest/list/blocks',
    pageable: true,
  });
  useLoading({finished});

  const getBlocks = (): Array<BlockData> => {
    if (!data) {
      return [];
    }
    return data.pages.reduce((accum: Array<BlockData>, current) => {
      return current ? [...accum, ...current] : accum;
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
      .width(243)
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
      .width(121)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('time')
      .name('Time')
      .width(226)
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderTxCount = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('tx_count')
      .name('Tx Count')
      .width(166)
      .renderOption(numberWithCommas)
      .build();
  };

  const createHeaderProposer = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('proposer')
      .name('Proposer')
      .width(226)
      .colorName('blue')
      .renderOption((_, data) => (
        <DatatableItem.Publisher address={data.proposer} username={data.username} />
      ))
      .build();
  };

  const createHeaderTotalFees = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('total_fees')
      .name('Total Fees')
      .width(163)
      .renderOption(tatalFees => <DatatableItem.Amount value={tatalFees} denom={'ugnot'} />)
      .build();
  };

  return (
    <Datatable
      headers={createHeaders().map(item => {
        return {
          ...item,
          themeMode: themeMode,
        };
      })}
      datas={getBlocks()}
    />
  );
};
