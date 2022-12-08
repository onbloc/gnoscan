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

interface AccountTransactionData {
  hash: string;
  status: string;
  type: string;
  path: string | null;
  func: string;
  height: number;
  amount: {
    value_out: number;
    value_in: number;
    denom: string;
  };
  time: string;
  fee: {
    value: number;
    unit: string;
  };
}

interface ResponseData {
  total_hits: number;
  txs: Array<AccountTransactionData>;
}

interface Props {
  address: string;
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

export const AccountDetailDatatable = ({address}: Props) => {
  const [theme] = useTheme();
  const media = eachMedia();

  const {data, hasNext, fetchNextPage, finished} = usePageQuery<ResponseData>({
    key: 'account-detail/transactions',
    uri: API_URI + `/latest/account/txs/${address}`,
    pageable: true,
  });

  const getTransactionDatas = () => {
    if (!data) {
      return [];
    }
    return data.pages.reduce<Array<AccountTransactionData>>(
      (accum, current) => (current?.txs ? [...accum, ...current.txs] : accum),
      [],
    );
  };

  const createHeaders = () => {
    return [
      createHeaderTxHash(),
      createHeaderType(),
      createHeaderBlock(),
      createHeaderAmountIn(),
      createHeaderAmountOut(),
      createHeaderTime(),
      createHeaderFee(),
    ];
  };

  const createHeaderTxHash = () => {
    return DatatableOption.Builder.builder<AccountTransactionData>()
      .key('hash')
      .name('Tx Hash')
      .width(210)
      .colorName('blue')
      .renderOption((value, data) => (
        <DatatableItem.TxHash txHash={value} success={data.status === 'success'} />
      ))
      .tooltip(TOOLTIP_TX_HASH)
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<AccountTransactionData>()
      .key('type')
      .name('Type')
      .width(190)
      .colorName('blue')
      .tooltip(TOOLTIP_TYPE)
      .renderOption((_, data) => (
        <DatatableItem.Type type={data.type} func={data.func} packagePath={data.path} />
      ))
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<AccountTransactionData>()
      .key('height')
      .name('Block')
      .width(93)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderAmountIn = () => {
    return DatatableOption.Builder.builder<AccountTransactionData>()
      .key('amount')
      .name('Amount (In)')
      .width(160)
      .renderOption((amount: {value_in: number; value_out: number; denom: string}) => (
        <DatatableItem.Amount value={amount.value_in} denom={amount.denom} />
      ))
      .build();
  };

  const createHeaderAmountOut = () => {
    return DatatableOption.Builder.builder<AccountTransactionData>()
      .key('amount')
      .name('Amount (Out)')
      .width(160)
      .renderOption((amount: {value_in: number; value_out: number; denom: string}) => (
        <DatatableItem.Amount value={amount.value_out} denom={amount.denom} />
      ))
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<AccountTransactionData>()
      .key('time')
      .name('Time')
      .width(130)
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<AccountTransactionData>()
      .key('fee')
      .name('Fee')
      .width(129)
      .renderOption(({value, unit}: {value: number; unit: string}) => (
        <DatatableItem.Amount value={value} denom={unit} />
      ))
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
