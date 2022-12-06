'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import usePageQuery from '@/common/hooks/use-page-query';
import {DatatableItem} from '..';
import Link from 'next/link';

interface Realms {
  name: string;
  path: string;
  functions: number;
  block: number;
  publisher: string;
  username: string;
  total_calls: number;
  total_gas_used: number;
}

interface ResponseData {
  hits: number;
  next: boolean;
  realms: Array<Realms>;
}

export const RealmDatatable = () => {
  const [theme] = useTheme();
  const {data, fetchNextPage, sortOption, setSortOption} = usePageQuery<ResponseData>({
    key: 'realm/realm-list',
    uri: 'http://3.218.133.250:7677/latest/list/realms',
    pageable: true,
  });

  const getRealms = (): Array<Realms> => {
    if (!data) {
      return [];
    }
    return data.pages.reduce((accum: Array<Realms>, current) => {
      return [...accum, ...current.realms];
    }, []);
  };

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
    return DatatableOption.Builder.builder<Realms>()
      .key('name')
      .name('Name')
      .sort()
      .width(172)
      .build();
  };

  const createHeaderPath = () => {
    return DatatableOption.Builder.builder<Realms>()
      .key('path')
      .name('Path')
      .width(200)
      .colorName('blue')
      .renderOption(packagePath => <DatatableItem.RealmPakage packagePath={packagePath} />)
      .build();
  };

  const createHeaderFunctions = () => {
    return DatatableOption.Builder.builder<Realms>()
      .key('functions')
      .name('Functions')
      .width(121)
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<Realms>()
      .key('block')
      .name('Block')
      .width(93)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderPublisher = () => {
    return DatatableOption.Builder.builder<Realms>()
      .key('publisher')
      .name('Publisher')
      .width(201)
      .colorName('blue')
      .renderOption(publisher => (
        <span className="ellipsis">
          <Link href={`/accounts/${publisher}`}>{publisher}</Link>
        </span>
      ))
      .build();
  };

  const createHeaderTotalCalls = () => {
    return DatatableOption.Builder.builder<Realms>()
      .key('total_calls')
      .name('Total Calls')
      .sort()
      .width(166)
      .build();
  };

  const createHeaderTotalGasUsed = () => {
    return DatatableOption.Builder.builder<Realms>()
      .key('total_gas_used')
      .name('Total Gas Used')
      .width(166)
      .build();
  };

  return (
    <>
      <Datatable
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: theme,
          };
        })}
        sortOption={sortOption}
        setSortOption={setSortOption}
        datas={getRealms()}
      />
    </>
  );
};
