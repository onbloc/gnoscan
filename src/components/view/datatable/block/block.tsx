"use client";

import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { numberWithCommas } from "@/common/utils";
import { themeState } from "@/states";
import { useUsername } from "@/common/hooks/account/use-username";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import theme from "@/styles/theme";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "..";
import { Block } from "@/types/data-type";
import { Button } from "@/components/ui/button";

interface BlockDatatableProps {
  breakpoint: DEVICE_TYPE;
  data: Block[];
  isFetched: boolean;
  isError: boolean;
  isLoading: boolean;
  hasNextPage: boolean | undefined;

  fetchNextPage: () => void;
}

export const BlockDatatable = ({ breakpoint, data, isError, hasNextPage, fetchNextPage }: BlockDatatableProps) => {
  const themeMode = useRecoilValue(themeState);
  const { getNameWithMoniker } = useUsername();

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
      .renderOption((_, data) => <DatatableItem.BlockHash hash={data.hash} height={data.height} />)
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
      .renderOption(date => <DatatableItem.Date date={new Date(date).toISOString()} />)
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
      .renderOption((_, data) => (
        <DatatableItem.Publisher address={data.proposer} username={getNameWithMoniker(data.proposerRaw)} />
      ))
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
    <Container>
      <Datatable
        supported={!isError}
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={data}
      />

      {hasNextPage ? (
        <div className="button-wrapper">
          <Button className={`more-button ${breakpoint}`} radius={"4px"} onClick={() => fetchNextPage()}>
            {"View More Blocks"}
          </Button>
        </div>
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
    background-color: ${({ theme }) => theme.colors.base};
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
        color: ${({ theme }) => theme.colors.primary};
        background-color: ${({ theme }) => theme.colors.surface};
        ${theme.fonts.p4}
        font-weight: 600;

        &.desktop {
          width: 344px;
        }
      }
    }
  }
`;
