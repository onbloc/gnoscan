'use client';

import React, {useEffect, useState} from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import {DatatableItem} from '..';
import styled from 'styled-components';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {Transaction} from '@/types/data-type';
import theme from '@/styles/theme';
import {Button} from '@/components/ui/button';
import {eachMedia} from '@/common/hooks/use-media';
import {useTransactions} from '@/common/hooks/transactions/use-transactions';
import {useTokenMeta} from '@/common/hooks/common/use-token-meta';
import {useUsername} from '@/common/hooks/account/use-username';
import useLoading from '@/common/hooks/use-loading';

interface TransactionWithTime extends Transaction {
  time: string;
}

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw transaction <br />
    type and package path.
  </>
);

function mapDisplayFunctionName(type: string, functionName: string) {
  switch (type) {
    case 'MsgAddPackage':
      return 'AddPkg';
    case 'BankMsgSend':
      return 'Transfer';
    default:
      return functionName;
  }
}

export const TransactionDatatable = () => {
  const media = eachMedia();
  const themeMode = useRecoilValue(themeState);

  const {getTokenAmount} = useTokenMeta();
  const {isFetched, transactions, hasNextPage, isError, nextPage} = useTransactions({
    enabled: true,
  });
  const {isFetched: isFetchedUsername, getName} = useUsername();
  const [development, setDevelopment] = useState(false);

  useLoading({finished: (isFetched && isFetchedUsername) || isError});

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
    return DatatableOption.Builder.builder<TransactionWithTime>()
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
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key('type')
      .name('Type')
      .width(190)
      .colorName('blue')
      .tooltip(<TooltipContainer>{TOOLTIP_TYPE}</TooltipContainer>)
      .renderOption((_, data) => {
        const displayFunctionName = mapDisplayFunctionName(data.type, data.functionName);
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
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key('blockHeight')
      .name('Block')
      .width(113)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key('from')
      .name('From')
      .width(170)
      .colorName('blue')
      .renderOption((address, data) => (
        <DatatableItem.Publisher address={address} username={getName(address)} />
      ))
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key('amount')
      .name('Amount')
      .width(190)
      .renderOption((_, data) =>
        data.numOfMessage > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data.hash}`} />
        ) : (
          <DatatableItem.Amount {...getTokenAmount(data.amount.denom, data.amount.value)} />
        ),
      )
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key('time')
      .name('Time')
      .width(160)
      .className('time')
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key('fee')
      .name('Fee')
      .width(113)
      .className('fee')
      .renderOption(fee => <DatatableItem.Amount {...getTokenAmount(fee.denom, fee.value)} />)
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
        datas={transactions as TransactionWithTime[]}
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
