'use client';

import React, {useCallback} from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import usePageQuery from '@/common/hooks/use-page-query';
import {DatatableItem} from '..';
import {numberWithCommas} from '@/common/utils';
import useLoading from '@/common/hooks/use-loading';
import {API_URI, API_VERSION} from '@/common/values/constant-value';
import {useRecoilValue} from 'recoil';
import {themeState, tokenState} from '@/states';
import theme from '@/styles/theme';
import styled from 'styled-components';
import {eachMedia} from '@/common/hooks/use-media';
import {Button} from '@/components/ui/button';
import {isGRC20TokenModel, TokenModel} from '@/repositories/api/models/meta-token-model';

interface ResponseData {
  hits: number;
  next: boolean;
  tokens: Array<TokenData>;
}
interface TokenData {
  token: string;
  img_path: string;
  name: string;
  denom: string;
  holders: number;
  functions: Array<string>;
  decimals: number;
  min_denom: string;
  min_decimal: number;
  total_supply: number;
  pkg_path: string;
  symbol: string;
  publisher: string;
  publisher_username: string;
}

const TOOLTIP_PACAKGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gnoland.
  </>
);

export const TokenDatatable = () => {
  const media = eachMedia();
  const themeMode = useRecoilValue(themeState);
  const tokenInfos = useRecoilValue(tokenState);

  const {data, fetchNextPage, finished, hasNextPage} = usePageQuery<ResponseData>({
    key: ['token/token-list'],
    uri: API_URI + API_VERSION + '/list/tokens',
    pageable: true,
  });
  useLoading({finished});

  const getTokens = () => {
    if (!data) {
      return [];
    }
    return data.pages.reduce<Array<TokenData>>((accum, current) => {
      const latest =
        current?.tokens.map(token => ({
          ...token,
          img_path: getTokenMetaInfo(token),
        })) ?? [];
      return [...accum, ...latest];
    }, []);
  };

  const getTokenMetaInfo = useCallback(
    (token: TokenData) => {
      const tokenInfo = tokenInfos.find(tokenInfo => {
        if (!isGRC20TokenModel(tokenInfo)) {
          return false;
        }
        return `${tokenInfo.symbol}`.toUpperCase() === `${token.symbol}`.toUpperCase();
      });
      return tokenInfo?.image ?? '';
    },
    [tokenInfos],
  );

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
    return DatatableOption.Builder.builder<TokenData>()
      .key('token')
      .name('Token')
      .width(220)
      .renderOption((_, data) => (
        <DatatableItem.TokenTitle
          token={data.token}
          imagePath={data.img_path}
          name={data.name}
          symbol={data.symbol}
          pkgPath={data.pkg_path}
        />
      ))
      .build();
  };

  const createHeaderHolder = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('holders_count')
      .name('Holders')
      .width(110)
      .renderOption(numberWithCommas)
      .build();
  };

  const createHeaderFunction = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('functions')
      .name('Functions')
      .width(350)
      .className('functions')
      .renderOption(functions => <DatatableItem.Functions functions={functions} />)
      .build();
  };

  const createHeaderDecimal = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('decimals')
      .name('Decimals')
      .width(110)
      .build();
  };

  const createHeaderTotalSupply = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('total_supply')
      .name('Total Supply')
      .width(180)
      .renderOption((_, data) => (
        <DatatableItem.Amount
          value={`${data.total_supply}`}
          denom={''}
          maxSize="p4"
          minSize="body3"
        />
      ))
      .build();
  };

  const createHeaderPkgPath = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('pkg_path')
      .name('Path')
      .width(176)
      .colorName('blue')
      .tooltip(TOOLTIP_PACAKGE_PATH)
      .renderOption((_, data) => (
        <DatatableItem.RealmPakage packagePath={data.pkg_path} maxWidth={160} />
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
        datas={getTokens()}
      />
      {hasNextPage ? (
        <div className="button-wrapper">
          <Button className={`more-button ${media}`} radius={'4px'} onClick={() => fetchNextPage()}>
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
