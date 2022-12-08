'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import styled from 'styled-components';
import {Button} from '@/components/ui/button';
import theme from '@/styles/theme';
import {DatatableItem} from '..';
import usePageQuery from '@/common/hooks/use-page-query';
import {eachMedia} from '@/common/hooks/use-media';
import {API_URI} from '@/common/values/constant-value';

interface RealmTransactionData {
  tx_hash: string;
  success: boolean;
  type: string;
  func: string;
  bloc: number;
  pkg_path: string | null;
  from_address: string;
  amount: {
    amount: string;
    denom: string;
  };
  time: string;
  fee: number;
}

interface ResponseData {
  hits: number;
  next: boolean;
  txs: Array<RealmTransactionData>;
}

interface Props {
  pkgPath: string;
}

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

export const RealmDetailDatatable = ({pkgPath}: Props) => {
  const media = eachMedia();
  const [theme] = useTheme();

  const {data, hasNext, fetchNextPage, finished} = usePageQuery<ResponseData>({
    key: 'realm-detail/transactions',
    uri: API_URI + `/latest/realm/txs/${pkgPath}`,
    pageable: true,
  });

  const getTransactionDatas = () => {
    if (!data) {
      return [];
    }
    return data.pages.reduce<Array<RealmTransactionData>>(
      (accum, current) => (current?.txs ? [...accum, ...current.txs] : accum),
      [],
    );
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
    return DatatableOption.Builder.builder<RealmTransactionData>()
      .key('tx_hash')
      .name('Tx Hash')
      .width(210)
      .colorName('blue')
      .renderOption((value, data) => <DatatableItem.TxHash txHash={value} success={data.success} />)
      .tooltip(TOOLTIP_TX_HASH)
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<RealmTransactionData>()
      .key('type')
      .name('Type')
      .width(190)
      .colorName('blue')
      .tooltip(TOOLTIP_TYPE)
      .renderOption((_, data) => (
        <DatatableItem.Type type={data.type} func={data.func} packagePath={data.pkg_path} />
      ))
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<RealmTransactionData>()
      .key('block')
      .name('Block')
      .width(93)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<RealmTransactionData>()
      .key('from_address')
      .name('From')
      .width(160)
      .colorName('blue')
      .renderOption(address => <DatatableItem.Account address={address} />)
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<RealmTransactionData>()
      .key('amount')
      .name('Amount')
      .width(160)
      .renderOption((amount: {amount: number; denom: string}) => (
        <DatatableItem.Amount
          value={amount.amount}
          denom={amount.denom === '' ? 'gnot' : amount.denom}
        />
      ))
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<RealmTransactionData>()
      .key('time')
      .name('Time')
      .width(130)
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<RealmTransactionData>()
      .key('fee')
      .name('Fee')
      .width(129)
      .renderOption(value => <DatatableItem.Amount value={value} denom={'ugnot'} />)
      .build();
  };

  return (
    <Container>
      <Datatable
        loading={!finished}
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: theme,
          };
        })}
        datas={getTransactionDatas()}
      />

      {hasNext ? (
        <Button className={`more-button ${media}`} radius={'4px'} onClick={() => fetchNextPage()}>
          {'View More Transactions'}
        </Button>
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

    & > div {
      padding: 0;
    }

    .more-button {
      width: 100%;
      padding: 16px;
      color: ${({theme}) => theme.colors.primary};
      background-color: ${({theme}) => theme.colors.surface};
      ${theme.fonts.p4}
      font-weight: 600;
      margin-top: 4px;

      &.desktop {
        width: 344px;
      }
    }
  }
`;
