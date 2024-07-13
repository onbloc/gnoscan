'use client';

import React, {useEffect, useState} from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import {DatatableItem} from '..';
import {Button} from '@/components/ui/button';
import styled from 'styled-components';
import theme from '@/styles/theme';
import {numberWithCommas} from '@/common/utils';
import {eachMedia} from '@/common/hooks/use-media';
import useLoading from '@/common/hooks/use-loading';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {useRealms} from '@/common/hooks/realms/use-realms';
import {useUsername} from '@/common/hooks/account/use-username';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';

const TOOLTIP_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gnoland.
  </>
);

export const RealmDatatable = () => {
  const media = eachMedia();
  const themeMode = useRecoilValue(themeState);
  const {indexerQueryClient} = useNetworkProvider();
  const [sortOption, setSortOption] = useState<{field: string; order: string}>({
    field: 'none',
    order: 'none',
  });
  const {realms, isFetched, hasNextPage, nextPage: fetchNextPage} = useRealms(true, sortOption);
  const {isFetched: isFetchedUsername, getName} = useUsername();
  useLoading({finished: isFetched && isFetchedUsername});

  const createHeaders = () => {
    return [
      createHeaderName(),
      createHeaderPath(),
      createHeaderFunctions(),
      createHeaderBlock(),
      createHeaderPublisher(),
      createHeaderTotalCalls(),
      createHeaderTotalGasUsed(),
    ];
  };

  const createHeaderName = () => {
    return DatatableOption.Builder.builder()
      .key('packageName')
      .name('Name')
      .sort()
      .width(174)
      .build();
  };

  const createHeaderPath = () => {
    return DatatableOption.Builder.builder()
      .key('packagePath')
      .name('Path')
      .width(202) // removed functions column
      .colorName('blue')
      .tooltip(TOOLTIP_PATH)
      .renderOption(packagePath => (
        <DatatableItem.RealmPackage packagePath={packagePath} maxWidth={186} />
      ))
      .build();
  };

  const createHeaderFunctions = () => {
    return DatatableOption.Builder.builder()
      .key('packagePath')
      .name('Functions')
      .width(121)
      .renderOption(packagePath => <DatatableItem.LazyFunctions realmPath={packagePath} />)
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder()
      .key('blockHeight')
      .name('Block')
      .width(121)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderPublisher = () => {
    return DatatableOption.Builder.builder()
      .key('creator')
      .name('Publisher')
      .width(202)
      .colorName('blue')
      .renderOption(creator => (
        <DatatableItem.Publisher address={creator} username={getName(creator)} />
      ))
      .build();
  };

  const createHeaderTotalCalls = () => {
    return DatatableOption.Builder.builder()
      .key('totalCalls')
      .name('Total Calls')
      .sort()
      .width(163)
      .renderOption((_, data: any) => (
        <DatatableItem.LazyTotalCalls packagePath={data.packagePath} />
      ))
      .build();
  };

  const createHeaderTotalGasUsed = () => {
    return DatatableOption.Builder.builder()
      .key('packagePath')
      .name('Total Gas Used')
      .width(163)
      .renderOption(packagePath => <DatatableItem.LazyFeeAmount packagePath={packagePath} />)
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
        datas={realms}
        sortOption={sortOption}
        setSortOption={setSortOption}
        supported={!!indexerQueryClient}
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
