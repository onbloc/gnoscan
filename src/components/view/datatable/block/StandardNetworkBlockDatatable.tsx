"use client";

import React from "react";

import { numberWithCommas } from "@/common/utils";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { formatDate } from "@/common/utils/date-util";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "..";
import { CardTableContainer } from "../datatable.styles";
import { Block } from "@/types/data-type";
import { ViewMoreButton } from "@/components/ui/button";

interface BlockDatatableProps {
  breakpoint: DEVICE_TYPE;
  data: Block[];
  isError: boolean;
  hasNextPage: boolean | undefined;

  fetchNextPage: () => void;
}

export const StandardNetworkBlockDatatable = ({
  breakpoint,
  data,
  isError,
  hasNextPage,
  fetchNextPage,
}: BlockDatatableProps) => {
  const createHeaders = () => {
    return [
      createHeaderBlockHash(),
      createHeaderHeight(),
      createHeaderTime(),
      createHeaderTxCount(),
      createHeaderProposer(),
      createHeaderTotalFees(),
    ];
  };

  const createHeaderBlockHash = () => {
    return DatatableOption.Builder.builder<Block>()
      .key("block_hash")
      .name("Block Hash")
      .width(243)
      .colorName("blue")
      .renderOption((_, data) => (data.hash ? <DatatableItem.BlockHash hash={data.hash} height={data.height} /> : null))
      .build();
  };

  const createHeaderHeight = () => {
    return DatatableOption.Builder.builder<Block>()
      .key("height")
      .name("Height")
      .width(121)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<Block>()
      .key("time")
      .name("Time")
      .width(226)
      .renderOption(date => <DatatableItem.Date date={formatDate(date)} />)
      .build();
  };

  const createHeaderTxCount = () => {
    return DatatableOption.Builder.builder<Block>()
      .key("numTxs")
      .name("Tx Count")
      .width(166)
      .renderOption(numberWithCommas)
      .build();
  };

  const createHeaderProposer = () => {
    return DatatableOption.Builder.builder<Block>()
      .key("proposer")
      .name("Proposer")
      .width(226)
      .colorName("blue")
      .renderOption((_, data) => <DatatableItem.Publisher address={data.proposer} username={data.proposerRaw} />)
      .build();
  };

  const createHeaderTotalFees = () => {
    return DatatableOption.Builder.builder<Block>()
      .key("total_fees")
      .name("Total Fees")
      .width(163)
      .renderOption((_, data) => {
        if (data.numTxs === 0) {
          return <DatatableItem.Amount value={"0"} denom={"GNOT"} />;
        }
        return <DatatableItem.LazyBlockTotalFee blockHeight={data.height} defaultDenom={"GNOT"} />;
      })
      .build();
  };

  return (
    <CardTableContainer>
      <Datatable supported={!isError} headers={createHeaders()} datas={data} />

      {hasNextPage && (
        <div className="button-wrapper">
          <ViewMoreButton
            variant="table"
            breakpoint={breakpoint}
            text="View More Blocks"
            onClick={() => fetchNextPage()}
          />
        </div>
      )}
    </CardTableContainer>
  );
};
