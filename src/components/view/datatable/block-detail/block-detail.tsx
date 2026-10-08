"use client";
import React, { useMemo } from "react";

import { ViewMoreButton } from "@/components/ui/button";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "..";
import { FlushTableContainer } from "../datatable.styles";
import { Transaction } from "@/types/data-type";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";

interface Props {
  transactions: Transaction[];
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

export const BlockDetailDatatable = ({ transactions, isFetched, hasNextPage, nextPage }: Props) => {
  const { getTokenAmount } = useTokenMeta();

  const loaded = useMemo(() => {
    return isFetched;
  }, [isFetched]);

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
      .renderOption((_, data) => {
        return (
          <DatatableItem.Publisher
            address={data.from}
            username={data.fromName}
            label={data.fromLabel}
            labelType={data.fromLabelType}
          />
        );
      })
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
          <DatatableItem.StandardNetworkAmount data={amount} />
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
      .renderOption(({ value, denom }: { value: string; denom: string }) => (
        <DatatableItem.Amount {...getTokenAmount(denom, value)} />
      ))
      .build();
  };

  return (
    <FlushTableContainer>
      <Datatable loading={!loaded} headers={createHeaders()} datas={transactions} />
      {hasNextPage && <ViewMoreButton variant="table" text="View More Transactions" onClick={() => nextPage()} />}
    </FlushTableContainer>
  );
};
