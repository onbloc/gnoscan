'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import Link from 'next/link';
import {getDateDiff} from '@/common/utils/date-util';
import {textEllipsis} from '@/common/utils/string-util';
import {DatatableItem} from '..';
import styled from 'styled-components';
import usePageQuery from '@/common/hooks/use-page-query';

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
  tx_hash: string;
  success: boolean;
  type: string;
  func: string;
  block: number;
  from_address: string;
  pkg_path: string | null;
  amount: {
    value: number;
    denom: string;
  };
  time: string;
  gas_used: number;
}

export const TransactionDatatable = () => {
  const [theme] = useTheme();
  const {data} = usePageQuery<Array<TransactionData>>({
    key: 'transaction/transaction-list',
    uri: 'http://3.218.133.250:7677/latest/list/txs',
    pageable: true,
  });

  const getTransactions = (): Array<TransactionData> => {
    if (!data) {
      return [];
    }
    return data.pages.reduce((accum: Array<TransactionData>, current) => {
      return [...accum, ...current];
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
      .key('tx_hash')
      .name('Tx Hash')
      .width(210)
      .colorName('blue')
      .renderOption((value, data) => <DatatableItem.TxHash txHash={value} success={data.success} />)
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
        <DatatableItem.Type type={data.type} func={data.func} packagePath={data.pkg_path} />
      ))
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('block')
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
      .renderOption(address => <DatatableItem.Account address={address} />)
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('amount')
      .name('Amount')
      .width(204)
      .renderOption(amount => (
        <DatatableItem.Amount
          value={amount.value}
          denom={amount.denom === '' ? 'ugnot' : amount.denom}
        />
      ))
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('time')
      .name('Time')
      .width(130)
      .renderOption(value => `${getDateDiff(value)}`)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<TransactionData>()
      .key('gas_used')
      .name('Fee')
      .width(129)
      .renderOption(value => <DatatableItem.Amount value={value} denom={'ugnot'} />)
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
      datas={getTransactions()}
    />
  );
};

const TooltipContainer = styled.div`
  min-width: 132px;
`;
