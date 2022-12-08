'use client';

import React, {useEffect} from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import usePageQuery from '@/common/hooks/use-page-query';
import {DatatableItem} from '..';
import {numberWithCommas} from '@/common/utils';
import useLoading from '@/common/hooks/use-loading';

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
}

export const TokenDatatable = () => {
  const [theme] = useTheme();

  const {data, finished} = usePageQuery<Array<TokenData>>({
    key: 'token/token-list',
    uri: 'http://3.218.133.250:7677/latest/list/tokens',
    pageable: true,
  });
  useLoading({finished});

  const getTokens = () => {
    if (!data) {
      return [];
    }
    return data.pages.reduce<Array<TokenData>>(
      (accum, current) => (current ? [...accum, ...current] : accum),
      [],
    );
  };

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
      .width(230)
      .renderOption((_, data) => (
        <DatatableItem.TokenTitle
          token={data.token}
          imagePath={data.img_path}
          name={data.name}
          denom={data.denom}
        />
      ))
      .build();
  };

  const createHeaderHolder = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('holders')
      .name('Holders')
      .width(100)
      .renderOption(numberWithCommas)
      .build();
  };

  const createHeaderFunction = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('functions')
      .name('Functions')
      .width(329)
      .renderOption(functions => <DatatableItem.Functions functions={functions} />)
      .build();
  };

  const createHeaderDecimal = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('decimals')
      .name('Decimals')
      .width(90)
      .build();
  };

  const createHeaderTotalSupply = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('total_supply')
      .name('Total Supply')
      .width(210)
      .renderOption(numberWithCommas)
      .build();
  };

  const createHeaderPkgPath = () => {
    return DatatableOption.Builder.builder<TokenData>()
      .key('pkg_path')
      .name('Pkg Path')
      .width(210)
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
      datas={getTokens()}
    />
  );
};
