/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import styled from "styled-components";
import theme from "@/styles/theme";
import { DatatableItem } from "..";
import { useRecoilValue } from "recoil";
import { themeState } from "@/states";
import { useGetTokenHoldersByid, useGetTokenById } from "@/common/react-query/token/api";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { TokenHolderModel } from "@/models/api/token/token-holder-model";
import { formatTokenDecimal } from "@/common/utils/token.utility";

import { TokenHolder } from "@/types/data-type";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";

interface Props {
  path: string[] | any;
}

export const TokenHoldersDatatablePage = ({ path }: Props) => {
  const themeMode = useRecoilValue(themeState);
  const { breakpoint } = useWindowSize();

  const { data: tokenData } = useGetTokenById(path);
  const { decimals, symbol } = tokenData?.data ?? { decimals: 0, symbol: "" };

  const { data, isFetched: isFetchedHolders, hasNextPage, fetchNextPage } = useGetTokenHoldersByid({ path });

  const tokenHolders: TokenHolder[] = React.useMemo(() => {
    if (!data?.pages) return [];

    const allItems = data.pages.flatMap(page => page.items);

    return allItems.map((item: TokenHolderModel, index: number): TokenHolder => {
      return {
        rank: index + 1,
        address: item.address,
        nameTag: item.nameTag,
        balance: {
          value: formatTokenDecimal(item.balance, decimals),
          denom: symbol,
        },
        percentage: item.percentage,
      };
    });
  }, [data?.pages, decimals, symbol]);

  if (!isFetchedHolders) return <TableSkeleton />;

  const createHeaders = () => {
    return [
      createHeaderRank(),
      createHeaderAddress(),
      createHeaderNameTag(),
      createHeaderBalance(),
      createHeaderPercentage(),
    ];
  };

  const createHeaderRank = () => {
    return DatatableOption.Builder.builder<TokenHolder>()
      .key("rank")
      .name("#")
      .width(80)
      .renderOption(rank => <span>{rank}</span>)
      .build();
  };

  const createHeaderAddress = () => {
    return DatatableOption.Builder.builder<TokenHolder>()
      .key("address")
      .name("Address")
      .width(275)
      .colorName("blue")
      .renderOption((_, data) => <DatatableItem.CallerCopy caller={data.address} />)
      .build();
  };

  const createHeaderNameTag = () => {
    return DatatableOption.Builder.builder<TokenHolder>()
      .key("nameTag")
      .name("Name Tag")
      .width(260)
      .renderOption(nameTag => <span>{nameTag || "-"}</span>)
      .build();
  };

  const createHeaderBalance = () => {
    return DatatableOption.Builder.builder<TokenHolder>()
      .key("balance")
      .name("Balance")
      .width(288)
      .renderOption((balance: { value: string; denom: string }) => (
        <DatatableItem.Amount value={balance.value} denom={balance.denom} />
      ))
      .build();
  };

  const createHeaderPercentage = () => {
    return DatatableOption.Builder.builder<TokenHolder>()
      .key("percentage")
      .name("Percentage")
      .width(243)
      .renderOption(percentage => <span>{percentage.toFixed(4)}%</span>)
      .build();
  };

  return (
    <Container>
      <Datatable
        loading={!isFetchedHolders}
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={tokenHolders as TokenHolder[]}
      />
      {hasNextPage ? (
        <Button className={`more-button ${breakpoint}`} radius={"4px"} onClick={() => fetchNextPage()}>
          {"View More Holders"}
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
