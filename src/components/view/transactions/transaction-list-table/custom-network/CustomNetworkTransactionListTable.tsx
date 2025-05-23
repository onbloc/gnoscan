"use client";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { themeState } from "@/states";
import { Transaction } from "@/types/data-type";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useUsername } from "@/common/hooks/account/use-username";

import * as S from "./CustomNetworkTransactionListTable.styles";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "@/components/view/datatable";
import { Button } from "@/components/ui/button";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

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
    case "MsgAddPackage":
      return "AddPkg";
    case "BankMsgSend":
      return "Transfer";
    default:
      return functionName;
  }
}

interface CustomNetworkTransactionListTableProps {
  breakpoint: DEVICE_TYPE;
  transactions: Transaction[];
  hasNextPage: boolean;
  isFetched: boolean;
  isLoading: boolean;
  nextPage: () => void;
}

export const CustomNetworkTransactionListTable = ({
  breakpoint,
  transactions,
  hasNextPage,
  nextPage,
  isFetched,
  isLoading,
}: CustomNetworkTransactionListTableProps) => {
  const themeMode = useRecoilValue(themeState);

  const { getTokenAmount } = useTokenMeta();
  const { isFetched: isFetchedUsername, getName } = useUsername();

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
      .key("hash")
      .name("Tx Hash")
      .width(215)
      .colorName("blue")
      .renderOption((value, data) => (
        <DatatableItem.TxHash txHash={value} status={data.success ? "success" : "failure"} />
      ))
      .build();
  };

  const createHeaderType = () => {
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key("type")
      .name("Function")
      .width(190)
      .colorName("blue")
      .tooltip(<S.TooltipContainer>{TOOLTIP_TYPE}</S.TooltipContainer>)
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
      .key("blockHeight")
      .name("Block")
      .width(113)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key("from")
      .name("From")
      .width(170)
      .colorName("blue")
      .renderOption((address, data) => <DatatableItem.Publisher address={address} username={getName(address)} />)
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key("amount")
      .name("Amount")
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
      .key("time")
      .name("Time")
      .width(160)
      .className("time")
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<TransactionWithTime>()
      .key("fee")
      .name("Fee")
      .width(113)
      .className("fee")
      .renderOption(fee => <DatatableItem.Amount {...getTokenAmount(fee.denom, fee.value)} />)
      .build();
  };

  if (isLoading || !isFetched || !isFetchedUsername) return <TableSkeleton />;

  return (
    <S.Container>
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
          <Button className={`more-button ${breakpoint}`} radius={"4px"} onClick={() => nextPage()}>
            {"View More Transactions"}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </S.Container>
  );
};
