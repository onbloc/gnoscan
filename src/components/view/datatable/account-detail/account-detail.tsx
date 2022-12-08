'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import useTheme from '@/common/hooks/use-theme';
import {getDateDiff} from '@/common/utils/date-util';
import styled from 'styled-components';
import {Button} from '@/components/ui/button';
import theme from '@/styles/theme';
import Text from '@/components/ui/text';
import {DatatableItem} from '..';
import usePageQuery from '@/common/hooks/use-page-query';
import {eachMedia} from '@/common/hooks/use-media';

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

  const {data, hasNext, fetchNextPage} = usePageQuery<ResponseData>({
    key: 'account-detail/transactions',
    uri: `http://3.218.133.250:7677/latest/account/txs/${address}`,
    pageable: true,
  });

  const getTransactionDatas = () => {
    if (!data) {
      return [];
    }
    return data.pages.reduce<Array<AccountTransactionData>>(
      (accum, current) => [...accum, ...current.txs],
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
      .renderOption(value => `${value ?? '-'}`)
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
      .renderOption(value => `${getDateDiff(value)}`)
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
      <div className="title-wrapper">
        <Text type={media === 'desktop' ? 'h4' : 'h6'} color="primary">
          {'Transactions'}
        </Text>
      </div>
      <Datatable
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
    background-color: ${({theme}) => theme.colors.base};
    border-radius: 10px;
    align-items: center;

    .title-wrapper {
      width: 100%;
      padding-top: 24px;
      padding-left: 24px;
    }

    .more-button {
      width: calc(100% - 32px);
      padding: 16px;
      color: ${({theme}) => theme.colors.primary};
      background-color: ${({theme}) => theme.colors.surface};
      ${theme.fonts.p4}
      font-weight: 600;
      margin-top: 4px;
      margin-bottom: 24px;

      &.desktop {
        width: 344px;
      }
    }
  }
`;
