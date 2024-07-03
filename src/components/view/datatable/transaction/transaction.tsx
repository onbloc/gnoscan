'use client';

import React, {useEffect, useState} from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import {DatatableItem} from '..';
import styled from 'styled-components';
import useLoading from '@/common/hooks/use-loading';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {Transaction} from '@/types/data-type';
import theme from '@/styles/theme';
import {Button} from '@/components/ui/button';
import {eachMedia} from '@/common/hooks/use-media';
import {useTransactions} from '@/common/hooks/transactions/use-transactions';

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw transaction <br />
    type and package path.
  </>
);

export const TransactionDatatable = () => {
  const media = eachMedia();
  const themeMode = useRecoilValue(themeState);

  const {transactions, isFetched, hasNextPage, nextPage} = useTransactions();
  const [development, setDevelopment] = useState(false);

  useLoading({finished: isFetched});

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
    return DatatableOption.Builder.builder<Transaction>()
      .key('hash')
      .name('Tx Hash')
      .width(215)
      .colorName('blue')
      .renderOption((value, data) => (
        <DatatableItem.TxHash
          txHash={value}
          status={data.success ? 'success' : 'failure'}
          development={development}
          height={data.blockHeight}
        />
      ))
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key('type')
      .name('Type')
      .width(190)
      .colorName('blue')
      .tooltip(<TooltipContainer>{TOOLTIP_TYPE}</TooltipContainer>)
      .renderOption((_, data) => {
        const displayFunctionName =
          data.type === 'MsgAddPackage'
            ? 'AddPkg'
            : data.type === 'BankMsgSend'
            ? 'Transfer'
            : data.functionName;
        return (
          <DatatableItem.Type
            type={data.type}
            func={displayFunctionName}
            packagePath={data.packagePath}
            msgNum={data.numOfMessage}
          />
        );
      })
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key('blockHeight')
      .name('Block')
      .width(113)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key('from')
      .name('From')
      .width(170)
      .colorName('blue')
      .renderOption((address, data) => (
        <DatatableItem.Publisher address={address} username={data.from} />
      ))
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key('amount')
      .name('Amount')
      .width(190)
      .renderOption((_, data) =>
        data.numOfMessage > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data.hash}`} />
        ) : (
          <DatatableItem.Amount value={data.amount.value} denom={data.amount.denom} />
        ),
      )
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key('time')
      .name('Time')
      .width(160)
      .className('time')
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<Transaction>()
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
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={transactions}
      />
      {hasNextPage ? (
        <div className="button-wrapper">
          <Button className={`more-button ${media}`} radius={'4px'} onClick={() => nextPage()}>
            {'View More Transactions'}
          </Button>
        </div>
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
    background-color: ${({theme}) => theme.colors.base};
    padding-bottom: 24px;
    border-radius: 10px;

    .button-wrapper {
      display: flex;
      width: 100%;
      height: auto;
      margin-top: 4px;
      padding: 0 20px;
      justify-content: center;

      .more-button {
        width: 100%;
        padding: 16px;
        color: ${({theme}) => theme.colors.primary};
        background-color: ${({theme}) => theme.colors.surface};
        ${theme.fonts.p4}
        font-weight: 600;

        &.desktop {
          width: 344px;
        }
      }
    }
  }
`;

const TooltipContainer = styled.div`
  min-width: 132px;
`;
