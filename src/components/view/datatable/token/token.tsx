'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import {DatatableItem} from '..';
import {numberWithCommas} from '@/common/utils';
import useLoading from '@/common/hooks/use-loading';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import theme from '@/styles/theme';
import styled from 'styled-components';
import {eachMedia} from '@/common/hooks/use-media';
import {Button} from '@/components/ui/button';
import {useTokens} from '@/common/hooks/tokens/use-tokens';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';

const TOOLTIP_PACAKGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gnoland.
  </>
);

export const TokenDatatable = () => {
  const media = eachMedia();
  const themeMode = useRecoilValue(themeState);

  const {indexerQueryClient} = useNetworkProvider();
  const {tokens, hasNextPage, isFetched, nextPage} = useTokens();

  useLoading({finished: isFetched || !indexerQueryClient});

  const createHeaders = () => {
    return [
      createHeaderToken(),
      createHeaderHolder(),
      createHeaderFunction(),
      createHeaderDecimal(),
      createHeaderTotalSupply(),
      createHeaderPkgPath(),
    ];
  };

  const createHeaderToken = () => {
    return DatatableOption.Builder.builder()
      .key('token')
      .name('Token')
      .width(220)
      .renderOption((_, data: any) => (
        <DatatableItem.TokenTitle
          token={data.symbol}
          imagePath={data.packagePath}
          name={data.name}
          symbol={data.symbol}
          pkgPath={data.packagePath}
        />
      ))
      .build();
  };

  const createHeaderHolder = () => {
    return DatatableOption.Builder.builder()
      .key('packagePath')
      .name('Holders')
      .width(110)
      .renderOption(packagePath => (
        <DatatableItem.LazyHolders realmPath={packagePath} maxSize="p4" minSize="body3" />
      ))
      .build();
  };

  const createHeaderFunction = () => {
    return DatatableOption.Builder.builder()
      .key('functions')
      .name('Functions')
      .width(350)
      .className('functions')
      .renderOption(functions => <DatatableItem.Functions functions={functions} />)
      .build();
  };

  const createHeaderDecimal = () => {
    return DatatableOption.Builder.builder().key('decimals').name('Decimals').width(110).build();
  };

  const createHeaderTotalSupply = () => {
    return DatatableOption.Builder.builder()
      .key('packagePath')
      .name('Total Supply')
      .width(180)
      .renderOption(packagePath => (
        <DatatableItem.LazyTotalSupply realmPath={packagePath} maxSize="p4" minSize="body3" />
      ))
      .build();
  };

  const createHeaderPkgPath = () => {
    return DatatableOption.Builder.builder()
      .key('packagePath')
      .name('Path')
      .width(176)
      .colorName('blue')
      .tooltip(TOOLTIP_PACAKGE_PATH)
      .renderOption(packagePath => (
        <DatatableItem.RealmPakage packagePath={packagePath} maxWidth={160} />
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
        datas={tokens}
        supported={!!indexerQueryClient}
      />
      {hasNextPage ? (
        <div className="button-wrapper">
          <Button className={`more-button ${media}`} radius={'4px'} onClick={() => nextPage()}>
            {'View More Tokens'}
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
