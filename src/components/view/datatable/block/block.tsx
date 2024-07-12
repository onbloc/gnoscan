'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import {DatatableItem} from '..';
import {numberWithCommas} from '@/common/utils';
import useLoading from '@/common/hooks/use-loading';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {Block} from '@/types/data-type';
import {Button} from '@/components/ui/button';
import {eachMedia} from '@/common/hooks/use-media';
import styled from 'styled-components';
import theme from '@/styles/theme';
import {useBlocks} from '@/common/hooks/blocks/use-blocks';
import {useUsername} from '@/common/hooks/account/use-username';

export const BlockDatatable = () => {
  const media = eachMedia();
  const themeMode = useRecoilValue(themeState);
  const {data: blocks, isFetched, fetchNextPage, hasNextPage} = useBlocks();
  const {getNameWithMoniker} = useUsername();

  useLoading({finished: isFetched});

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
    return DatatableOption.Builder.builder<Block>()
      .key('block_hash')
      .name('Block Hash')
      .width(243)
      .colorName('blue')
      .renderOption((_, data) => <DatatableItem.BlockHash hash={data.hash} height={data.height} />)
      .build();
  };

  const createHeaderHeight = () => {
    return DatatableOption.Builder.builder<Block>()
      .key('height')
      .name('Height')
      .width(121)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<Block>()
      .key('time')
      .name('Time')
      .width(226)
      .renderOption(date => <DatatableItem.Date date={new Date(date).toISOString()} />)
      .build();
  };

  const createHeaderTxCount = () => {
    return DatatableOption.Builder.builder<Block>()
      .key('numTxs')
      .name('Tx Count')
      .width(166)
      .renderOption(numberWithCommas)
      .build();
  };

  const createHeaderProposer = () => {
    return DatatableOption.Builder.builder<Block>()
      .key('proposer')
      .name('Proposer')
      .width(226)
      .colorName('blue')
      .renderOption((_, data) => (
        <DatatableItem.Publisher
          address={data.proposer}
          username={getNameWithMoniker(data.proposerRaw)}
        />
      ))
      .build();
  };

  const createHeaderTotalFees = () => {
    return DatatableOption.Builder.builder<Block>()
      .key('total_fees')
      .name('Total Fees')
      .width(163)
      .renderOption(totalFees => (
        <DatatableItem.Amount value={totalFees?.value || 0} denom={totalFees?.denom || ''} />
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
        datas={blocks}
      />

      {hasNextPage ? (
        <div className="button-wrapper">
          <Button className={`more-button ${media}`} radius={'4px'} onClick={() => fetchNextPage()}>
            {'View More Blocks'}
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
