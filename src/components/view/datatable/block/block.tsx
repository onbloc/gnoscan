'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import usePageQuery from '@/common/hooks/use-page-query';
import {DatatableItem} from '..';
import {numberWithCommas} from '@/common/utils';
import useLoading from '@/common/hooks/use-loading';
import {API_URI, API_VERSION} from '@/common/values/constant-value';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {ValueWithDenomType} from '@/types/data-type';
import {Button} from '@/components/ui/button';
import {eachMedia} from '@/common/hooks/use-media';
import styled from 'styled-components';
import theme from '@/styles/theme';

interface ResponseData {
  hits: number;
  next: boolean;
  blocks: Array<BlockData>;
}
interface BlockData {
  block_hash: string;
  height: number;
  time: string;
  num_txs: number;
  proposer: string;
  proposer_username?: string;
  total_fees: ValueWithDenomType;
}

export const BlockDatatable = () => {
  const media = eachMedia();
  const themeMode = useRecoilValue(themeState);
  const {data, fetchNextPage, sortOption, setSortOption, finished, hasNextPage} =
    usePageQuery<ResponseData>({
      key: ['block/block-list', API_URI + API_VERSION + '/list/blocks'],
      uri: API_URI + API_VERSION + '/list/blocks',
      pageable: true,
    });
  useLoading({finished});

  const getBlocks = (): any => {
    if (!data) {
      return [];
    }
    return data.pages.reduce((accum: Array<BlockData>, current) => {
      return current ? [...accum, ...current.blocks] : accum;
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
      .key('num_txs')
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
        <DatatableItem.Publisher address={data.proposer} username={data.proposer_username} />
      ))
      .build();
  };

  const createHeaderTotalFees = () => {
    return DatatableOption.Builder.builder<BlockData>()
      .key('total_fees')
      .name('Total Fees')
      .width(163)
      .renderOption(totalFees => (
        <DatatableItem.Amount value={totalFees.value} denom={totalFees.denom} />
      ))
      .build();
  };

  return (
    <Container>
      <Datatable
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={getBlocks()}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {hasNextPage ? (
        <div className="button-wrapper">
          <Button className={`more-button ${media}`} radius={'4px'} onClick={() => fetchNextPage()}>
            {'View More Realms'}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </Container>
  );
};

const Container = styled.div<{maxWidth?: number}>`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    align-items: center;
    background-color: ${({theme}) => theme.colors.base};
    padding-bottom: 24px;
    border-radius: 10px;

    .button-wrapper {
      display: flex;
      width: 100%;
      height: auto;
      margin-top: 4px;
      padding: 0 20px;
      justify-content: center;

      .more-button {
        width: 100%;
        padding: 16px;
        color: ${({theme}) => theme.colors.primary};
        background-color: ${({theme}) => theme.colors.surface};
        ${theme.fonts.p4}
        font-weight: 600;

        &.desktop {
          width: 344px;
        }
      }
    }
  }
`;
