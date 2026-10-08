"use client";

import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { ViewMoreButton } from "@/components/ui/button";
import { DatatableItem } from "..";
import { FlushTableContainer } from "../datatable.styles";
import { Amount, Transaction } from "@/types/data-type";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";

interface Props {
  address: string;
  data: Transaction[];
  isFetched: boolean;
  hasNextPage?: boolean;
  nextPage: () => void;
}

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw transaction <br />
    type and package path.
  </>
);

export const AccountDetailDatatable = ({ address, data, isFetched, hasNextPage, nextPage }: Props) => {
  const { getTokenAmount } = useTokenMeta();

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
    return DatatableOption.Builder.builder<Transaction>()
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

  const createHeaderAmountIn = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("amount")
      .name("Amount (In)")
      .width(180)
      .renderOption((amount: Amount, data) =>
        data.numOfMessage > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data.hash}`} />
        ) : new BigNumber(amount?.value).isZero() ? (
          <span>-</span>
        ) : (
          <DatatableItem.Amount {...getTokenAmount(amount?.denom || "", amount?.value || 0)} />
        ),
      )
      .build();
  };

  const createHeaderAmountOut = () => {
    return DatatableOption.Builder.builder<Transaction>()
      .key("amountOut")
      .name("Amount (Out)")
      .width(180)
      .renderOption((amount: Amount, data) =>
        data.numOfMessage > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data.hash}`} />
        ) : new BigNumber(amount?.value).isZero() ? (
          <span>-</span>
        ) : (
          <DatatableItem.Amount {...getTokenAmount(amount?.denom || "", amount?.value || 0)} />
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
      .className("fee")
      .width(113)
      .renderOption(({ value, denom }: { value: string; denom: string }) => (
        <DatatableItem.Amount {...getTokenAmount(denom, value)} />
      ))
      .build();
  };

  return (
    <FlushTableContainer>
      <Datatable loading={!isFetched} headers={createHeaders()} datas={data || []} />
      {hasNextPage && <ViewMoreButton variant="table" text="View More Transactions" onClick={() => nextPage()} />}
    </FlushTableContainer>
  );
};
