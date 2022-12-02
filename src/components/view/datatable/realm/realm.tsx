'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import Link from 'next/link';

export const RealmDatatable = <T extends {[key in string]: any}>({datas}: {datas: Array<T>}) => {
  const [theme] = useTheme();

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
    return DatatableOption.Builder.builder<T>().key('name').name('Name').width(172).build();
  };

  const createHeaderPath = () => {
    return DatatableOption.Builder.builder<T>()
      .key('path')
      .name('Path')
      .width(200)
      .colorName('blue')
      .build();
  };

  const createHeaderFunctions = () => {
    return DatatableOption.Builder.builder<T>()
      .key('functions')
      .name('Functions')
      .width(121)
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<T>()
      .key('block')
      .name('Block')
      .width(93)
      .colorName('blue')
      .build();
  };

  const createHeaderPublisher = () => {
    return DatatableOption.Builder.builder<T>()
      .key('publisher')
      .name('Publisher')
      .width(201)
      .colorName('blue')
      .build();
  };

  const createHeaderTotalCalls = () => {
    return DatatableOption.Builder.builder<T>()
      .key('total_calls')
      .name('Total Calls')
      .width(166)
      .build();
  };

  const createHeaderTotalGasUsed = () => {
    return DatatableOption.Builder.builder<T>()
      .key('total_gas_used')
      .name('Total Gas Used')
      .width(166)
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
