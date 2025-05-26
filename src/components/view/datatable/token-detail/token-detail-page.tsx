/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import styled from "styled-components";
import theme from "@/styles/theme";
import { DatatableItem } from "..";
import { useRecoilValue } from "recoil";
import { themeState } from "@/states";
import { useGetTokenTransactionsByid } from "@/common/react-query/token/api";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { useWindowSize } from "@/common/hooks/use-window-size";

import { Transaction } from "@/types/data-type";
import { TokenTransactionModel } from "@/models/api/token/token-model";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";

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

export const TokenDetailDatatablePage = ({ path }: Props) => {
  const themeMode = useRecoilValue(themeState);
  const { breakpoint } = useWindowSize();

  const { data, isFetched: isFetchedTransactions, hasNextPage, fetchNextPage } = useGetTokenTransactionsByid({ path });

  const tokenTransactions: Transaction[] = React.useMemo(() => {
    if (!data?.pages) return [];

    const allItems = data.pages.flatMap(page => page.items);

    return allItems.map((item: TokenTransactionModel): Transaction => {
      return {
        hash: item.txHash,
        success: item.successYn,
        numOfMessage: item.messageCount,
        type: item.func[0].messageType,
        packagePath: item.func[0].pkgPath,
        functionName: item.func[0].funcType,
        blockHeight: item.blockHeight,
        from: item.fromAddress,
        fromName: item.fromName,
        to: item.toAddress,
        toName: item.toName,
        amount: item.amount,
        time: item.timestamp,
        fee: item.fee,
      };
    });
  }, [data?.pages]);

  if (!isFetchedTransactions) return <TableSkeleton />;

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
      .key("hash")
      .name("Tx Hash")
      .width(210)
      .colorName("blue")
      .renderOption((value, data) => (
        <DatatableItem.TxHash txHash={value} status={data.success ? "success" : "failure"} />
      ))
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("type")
      .name("Function")
      .width(190)
      .colorName("blue")
      .tooltip(TOOLTIP_TYPE)
      .renderOption((_, data) => (
        <DatatableItem.Type
          type={data.type}
          func={data.functionName}
          packagePath={data.packagePath}
          msgNum={data.numOfMessage - 1}
        />
      ))
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("blockHeight")
      .name("Block")
      .width(113)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("from")
      .name("From")
      .width(170)
      .colorName("blue")
      .renderOption((_, data) => <DatatableItem.Account address={data.from} addressName={data.fromName} />)
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("amount")
      .name("Amount")
      .width(190)
      .renderOption((amount: { value: string; denom: string }, data) =>
        data.numOfMessage > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data.hash}`} />
        ) : (
          <DatatableItem.StandardNetworkAmount data={data.amount} />
        ),
      )
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("time")
      .name("Time")
      .width(160)
      .className("time")
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("fee")
      .name("Fee")
      .width(113)
      .className("fee")
      .renderOption(fee => <DatatableItem.Amount {...toGNOTAmount(fee.value, fee.denom)} />)
      .build();
  };

  return (
    <Container>
      <Datatable
        loading={!isFetchedTransactions}
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={tokenTransactions as Transaction[]}
      />
      {hasNextPage ? (
        <Button className={`more-button ${breakpoint}`} radius={"4px"} onClick={() => fetchNextPage()}>
          {"View More Transactions"}
        </Button>
      ) : (
        <></>
      )}
    </Container>
  );
};

const Container = styled.div<{ maxWidth?: number }>`
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
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.surface};
      ${theme.fonts.p4}
      font-weight: 600;
      margin-top: 24px;

      &.desktop {
        width: 344px;
      }
    }
  }
`;
