'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';

export const TokenDatatable = <T extends {[key in string]: any}>({datas}: {datas: Array<T>}) => {
  const [theme] = useTheme();

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
    return DatatableOption.Builder.builder<T>().key('token').name('Token').width(230).build();
  };

  const createHeaderHolder = () => {
    return DatatableOption.Builder.builder<T>().key('holder').name('Holders').width(100).build();
  };

  const createHeaderFunction = () => {
    return DatatableOption.Builder.builder<T>()
      .key('function')
      .name('Functions')
      .width(329)
      .build();
  };

  const createHeaderDecimal = () => {
    return DatatableOption.Builder.builder<T>().key('decimal').name('Decimals').width(90).build();
  };

  const createHeaderTotalSupply = () => {
    return DatatableOption.Builder.builder<T>()
      .key('total_supply')
      .name('Total Supply')
      .width(210)
      .build();
  };

  const createHeaderPkgPath = () => {
    return DatatableOption.Builder.builder<T>().key('pkg_path').name('Pkg Path').width(210).build();
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
