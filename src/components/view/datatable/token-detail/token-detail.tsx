'use client';

import React from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import styled from 'styled-components';
import {Button} from '@/components/ui/button';
import theme from '@/styles/theme';
import {DatatableItem} from '..';
import usePageQuery from '@/common/hooks/use-page-query';
import {eachMedia} from '@/common/hooks/use-media';
import {API_URI, API_VERSION} from '@/common/values/constant-value';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {StatusKeyType, statusObj} from '@/common/utils';
interface TokenTransactionData {
  tx_hash: string;
  status: StatusKeyType;
  type: string;
  bloc: number;
  from: string;
  pkg_func: string;
  pkg_path: string | null;
  msg_num: number;
  amount: {
    value: string;
    denom: string;
  };
  time: string;
  fee: {
    value: string;
    denom: string;
  };
}

interface ResponseData {
  txs: Array<TokenTransactionData>;
}

interface Props {
  path: string[] | any;
}

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw transaction <br />
    type and package path.
  </>
);

export const TokenDetailDatatable = ({path}: Props) => {
  const media = eachMedia();
  const themeMode = useRecoilValue(themeState);

  const {data, fetchNextPage, finished, hasNextPage} = usePageQuery<ResponseData>({
    key: 'token-detail/transactions',
    uri: API_URI + API_VERSION + `/token/txs/${path.join('/')}`,
    pageable: true,
  });
  if (data) console.log(data);
  const getTransactionDatas = () => {
    if (!data) {
      return [];
    }
    return data.pages.reduce<Array<TokenTransactionData>>(
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
    return DatatableOption.Builder.builder<TokenTransactionData>()
      .key('hash')
      .name('Tx Hash')
      .width(210)
      .colorName('blue')
      .renderOption((value, data) => <DatatableItem.TxHash txHash={value} status={data.status} />)
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<TokenTransactionData>()
      .key('type')
      .name('Type')
      .width(190)
      .colorName('blue')
      .tooltip(TOOLTIP_TYPE)
      .renderOption((_, data) => (
        <DatatableItem.Type
          type={data.type}
          func={data.pkg_func}
          packagePath={data.pkg_path}
          msgNum={data.msg_num}
        />
      ))
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<TokenTransactionData>()
      .key('height')
      .name('Block')
      .width(113)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<TokenTransactionData>()
      .key('caller_address')
      .name('From')
      .width(170)
      .colorName('blue')
      .renderOption(address => <DatatableItem.Account address={address} />)
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<TokenTransactionData>()
      .key('amount')
      .name('Amount')
      .width(190)
      .renderOption((amount: {value: string; denom: string}, data) =>
        data.msg_num > 1 ? (
          <DatatableItem.HasLink
            text="More"
            path={`/transactions/details?txhash=${data.tx_hash}`}
          />
        ) : (
          <DatatableItem.Amount
            value={amount.value}
            denom={amount.denom === '' ? 'gnot' : amount.denom}
          />
        ),
      )
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<TokenTransactionData>()
      .key('time')
      .name('Time')
      .width(160)
      .className('time')
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<TokenTransactionData>()
      .key('fee')
      .name('Fee')
      .width(113)
      .className('fee')
      .renderOption(fee => <DatatableItem.Amount value={fee.value} denom={fee.denom} />)
      .build();
  };

  return (
    <Container>
      <Datatable
        loading={!finished}
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={getTransactionDatas()}
      />

      {hasNextPage ? (
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
