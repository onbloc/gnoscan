'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import Link from 'next/link';
import {getDateDiff} from '@/common/utils/date-util';
import {textEllipsis} from '@/common/utils/string-util';
import {TransactionDatatableItem} from '.';

const TOOLTIP_TX_HASH = (
  <>
    Transctions have been temporarily
    <br />
    assigned with values in <b>[height_order]</b>
    <br />
    format, as the tx hashing function is
    <br />
    still under development on Gnoland.
  </>
);

export const TransactionDatatable = <T extends {[key in string]: any}>({
  datas,
}: {
  datas: Array<T>;
}) => {
  const [theme] = useTheme();

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
    return DatatableOption.Builder.builder<T>()
      .key('tx_hash')
      .name('Tx Hash')
      .width(210)
      .colorName('blue')
      .renderOption((value, data) => (
        <TransactionDatatableItem.TxHash txHash={value} success={data.success} />
      ))
      .tooltip(TOOLTIP_TX_HASH)
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<T>()
      .key('type')
      .name('Type')
      .width(190)
      .colorName('blue')
      .renderOption((_, data) => (
        <TransactionDatatableItem.Type type={data.type} func={data.func} />
      ))
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

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<T>()
      .key('from_address')
      .name('From')
      .width(160)
      .colorName('blue')
      .renderOption(value => <Link href={`/accounts/${value}`}>{textEllipsis(value, 6)}</Link>)
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<T>()
      .key('amount')
      .name('Amount')
      .width(204)
      .renderOption(value => `${value.value} ${value.denom}`)
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<T>()
      .key('time')
      .name('Time')
      .width(130)
      .renderOption(value => `${getDateDiff(value)}`)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<T>()
      .key('gas_used')
      .name('Fee')
      .width(129)
      .renderOption(value => `${value} GNOT`)
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
