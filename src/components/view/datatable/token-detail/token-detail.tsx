/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BigNumber from "bignumber.js";
import React from "react";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { ViewMoreButton } from "@/components/ui/button";
import { DatatableItem } from "..";
import { FlushTableContainer } from "../datatable.styles";
import { eachMedia } from "@/common/hooks/use-media";
import { useToken } from "@/common/hooks/tokens/use-token";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useTokenTransactions } from "@/common/hooks/tokens/use-token-transactions";
import { useUsername } from "@/common/hooks/account/use-username";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

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

export const TokenDetailDatatable = ({ path }: Props) => {
  const media = eachMedia();

  const { isFetched: isFetchedToken } = useToken(path);
  const { isFetchedGRC20Tokens, getTokenAmount } = useTokenMeta();
  const { isFetched: isFetchedUsername } = useUsername();
  const { isFetchedTransactions, transactions, hasNextPage, nextPage } = useTokenTransactions(path);

  const isFetched = React.useMemo(
    () => isFetchedToken && isFetchedGRC20Tokens && isFetchedUsername,
    [isFetchedToken, isFetchedGRC20Tokens, isFetchedUsername],
  );

  if (!isFetched) return <TableSkeleton />;

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
    return DatatableOption.Builder.builder<any>()
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
    return DatatableOption.Builder.builder<any>()
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
    return DatatableOption.Builder.builder<any>()
      .key("blockHeight")
      .name("Block")
      .width(113)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderFrom = () => {
    return DatatableOption.Builder.builder<any>()
      .key("from")
      .name("From")
      .width(170)
      .colorName("blue")
      .renderOption(address => <DatatableItem.Account address={address} />)
      .build();
  };

  const createHeaderAmount = () => {
    return DatatableOption.Builder.builder<any>()
      .key("amount")
      .name("Amount")
      .width(190)
      .renderOption((amount: { value: string; denom: string }, data) =>
        data.numOfMessage > 1 ? (
          <DatatableItem.HasLink text="More" path={`/transactions/details?txhash=${data.hash}`} />
        ) : new BigNumber(amount?.value).isZero() ? (
          <span>-</span>
        ) : (
          <DatatableItem.Amount {...getTokenAmount(amount.denom, amount.value)} />
        ),
      )
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<any>()
      .key("time")
      .name("Time")
      .width(160)
      .className("time")
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createHeaderFee = () => {
    return DatatableOption.Builder.builder<any>()
      .key("fee")
      .name("Fee")
      .width(113)
      .className("fee")
      .renderOption(fee => <DatatableItem.Amount {...getTokenAmount(fee.denom, fee.value)} />)
      .build();
  };

  return (
    <FlushTableContainer>
      <Datatable loading={!isFetchedTransactions} headers={createHeaders()} datas={transactions as any[]} />

      {hasNextPage && (
        <ViewMoreButton variant="table" breakpoint={media} text="View More Transactions" onClick={() => nextPage()} />
      )}
    </FlushTableContainer>
  );
};
