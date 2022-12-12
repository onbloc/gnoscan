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

interface BlockTransactionData {
  hash: string;
  status: string;
  type: string;
  func: string;
  from_address: string;
  block: number;
  pkg_path: string | null;
  amount: {
    value: number;
    denom: string;
  };
  time: string;
  fee: {
    value: number;
    denom: string;
  };
}

interface ResponseData {
  txs: Array<BlockTransactionData>;
}

interface Props {
  height: string | number;
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

export const BlockDetailDatatable = ({height}: Props) => {
  const [theme] = useTheme();
  const media = eachMedia();

  const {data, hasNext, fetchNextPage, finished} = usePageQuery<ResponseData>({
    key: 'block-detail/transactions',
    uri: API_URI + `/latest/block/txs/${height}`,
    pageable: true,
  });

  const getTransactionDatas = () => {
    if (!data) {
      return [];
    }
    return data.pages.reduce<Array<BlockTransactionData>>(
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
    return DatatableOption.Builder.builder<BlockTransactionData>()
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
    return DatatableOption.Builder.builder<BlockTransactionData>()
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
    return DatatableOption.Builder.builder<BlockTransactionData>()
      .key('block')
      .name('Block')
      .width(93)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<BlockTransactionData>()
      .key('from_address')
      .name('From')
      .width(160)
      .colorName('blue')
      .renderOption(fromAddress => <DatatableItem.Account address={fromAddress} />)
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<BlockTransactionData>()
      .key('amount')
      .name('Amount')
      .width(160)
      .renderOption((amount: {value: number; denom: string}) => (
        <DatatableItem.Amount value={amount.value} denom={amount.denom} />
      ))
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<BlockTransactionData>()
      .key('time')
      .name('Time')
      .width(204)
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<BlockTransactionData>()
      .key('fee')
      .name('Fee')
      .width(129)
      .renderOption(({value, denom}: {value: number; denom: string}) => (
        <DatatableItem.Amount value={value} denom={denom} />
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
      margin-top: 24px;

      &.desktop {
        width: 344px;
      }
    }
  }
`;
