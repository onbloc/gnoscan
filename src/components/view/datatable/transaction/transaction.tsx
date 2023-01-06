'use client';

import React, {useEffect, useState} from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import Link from 'next/link';
import {DatatableItem} from '..';
import styled from 'styled-components';
import usePageQuery from '@/common/hooks/use-page-query';
import useLoading from '@/common/hooks/use-loading';
import {API_URI, API_VERSION} from '@/common/values/constant-value';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {ValueWithDenomType} from '@/types/data-type';

const TOOLTIP_TX_HASH = (
  <>
    Transctions have been temporarily <br />
    assigned with values in <b>[height_order]</b>
    <br />
    format, as the tx hashing function is
    <br />
    still under development on Gnoland.
    <br />
  </>
);

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw transaction <br />
    type and package path.
  </>
);

interface TransactionData {
  hash: string;
  status: string;
  type: string;
  pkg_func: string;
  height: number;
  from_username: string | undefined;
  from_address: string;
  pkg_path: string | null;
  amount: ValueWithDenomType;
  time: string;
  fee: ValueWithDenomType;
  num_msgs: number;
}

export const TransactionDatatable = () => {
  const themeMode = useRecoilValue(themeState);
  const {data, finished} = usePageQuery<Array<TransactionData>>({
    key: 'transaction/transaction-list',
    uri: API_URI + API_VERSION + '/list/txs',
    pageable: true,
  });
  useLoading({finished});
  const [development, setDevelopment] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydownEvent);
    window.addEventListener('keyup', handleKeyupEvent);

    return () => {
      window.removeEventListener('keydown', handleKeydownEvent);
      window.removeEventListener('keyup', handleKeyupEvent);
    };
  }, []);

  const handleKeydownEvent = (event: KeyboardEvent) => {
    if (event.code === 'Backquote') {
      setDevelopment(true);
      setTimeout(() => setDevelopment(false), 500);
    }
  };

  const handleKeyupEvent = (event: KeyboardEvent) => {
    if (event.code === 'Backquote') {
      setDevelopment(false);
    }
  };

  const getTransactions = (): Array<TransactionData> => {
    if (!data) {
      return [];
    }
    console.log(';;;;', data);
    return data.pages.reduce((accum: Array<TransactionData>, current) => {
      return current ? [...accum, ...current] : accum;
    }, []);
  };

  const createHeaders = () => {
    return [
      createHeaderTxHash(),
      createHeaderType(),
      createHeaderBlock(),
      createHeaderFrom(),
      createHeaderAmount(),
      createHeaderTime(),
      createHeaderFee(),
    ];
  };

  const createHeaderTxHash = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('hash')
      .name('Tx Hash')
      .width(210)
      .colorName('blue')
      .renderOption((value, data) => (
        <DatatableItem.TxHash
          txHash={value}
          status={data.status}
          development={development}
          height={data.height}
        />
      ))
      .tooltip(TOOLTIP_TX_HASH)
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('type')
      .name('Type')
      .width(190)
      .colorName('blue')
      .tooltip(<TooltipContainer>{TOOLTIP_TYPE}</TooltipContainer>)
      .renderOption((_, data) => (
        <DatatableItem.Type
          type={data.type}
          func={data.pkg_func}
          packagePath={data.pkg_path}
          msgNum={data.num_msgs}
        />
      ))
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('height')
      .name('Block')
      .width(93)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('from_address')
      .name('From')
      .width(160)
      .colorName('blue')
      .renderOption((address, data) => (
        <DatatableItem.Publisher address={address} username={data?.from_username} />
      ))
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('amount')
      .name('Amount')
      .width(204)
      .renderOption((_, data) =>
        data.num_msgs > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/${data.hash}`} />
        ) : (
          <DatatableItem.Amount value={data.amount.value} denom={data.amount.denom} />
        ),
      )
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('time')
      .name('Time')
      .width(204)
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('fee')
      .name('Fee')
      .width(129)
      .renderOption(fee => <DatatableItem.Amount value={fee.value} denom={fee.denom} />)
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
      datas={getTransactions()}
    />
  );
};

const TooltipContainer = styled.div`
  min-width: 132px;
`;
