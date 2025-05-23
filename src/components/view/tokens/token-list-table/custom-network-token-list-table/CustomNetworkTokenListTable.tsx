/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRecoilValue } from "recoil";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { themeState } from "@/states";

import * as S from "./CustomNetworkTokenListTable.styles";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "../../../datatable";
import { Button } from "@/components/ui/button";
import TableSkeleton from "../../../common/table-skeleton/TableSkeleton";
import { GRC20Info } from "@/repositories/realm-repository.ts";
import { GRC20InfoWithLogo } from "@/common/mapper/token/token-mapper";

const TOOLTIP_PACAKGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

interface TokenListTableProps {
  breakpoint: DEVICE_TYPE;
  tokens: GRC20Info[] | GRC20InfoWithLogo[];
  hasNextPage: boolean;
  isFetched: boolean;
  nextPage: () => void;
}

export const CustomNetworkTokenListTable = ({
  breakpoint,
  tokens,
  hasNextPage,
  isFetched,
  nextPage,
}: TokenListTableProps) => {
  const themeMode = useRecoilValue(themeState);
  const { indexerQueryClient } = useNetworkProvider();

  const createHeaders = () => {
    return [
      createHeaderToken(),
      createHeaderHolder(),
      createHeaderFunction(),
      createHeaderDecimal(),
      createHeaderTotalSupply(),
      createHeaderPkgPath(),
    ];
  };

  const createHeaderToken = () => {
    return DatatableOption.Builder.builder()
      .key("token")
      .name("Token")
      .width(220)
      .renderOption((_, data: any) => (
        <DatatableItem.TokenTitle
          token={data.symbol}
          imagePath={data.packagePath}
          name={data.name}
          symbol={data.symbol}
          pkgPath={data.packagePath}
        />
      ))
      .build();
  };

  const createHeaderHolder = () => {
    return DatatableOption.Builder.builder()
      .key("packagePath")
      .name("Holders")
      .width(110)
      .renderOption(packagePath => <DatatableItem.LazyHolders realmPath={packagePath} maxSize="p4" minSize="body3" />)
      .build();
  };

  const createHeaderFunction = () => {
    return DatatableOption.Builder.builder()
      .key("functions")
      .name("Functions")
      .width(350)
      .className("functions")
      .renderOption(functions => <DatatableItem.Functions functions={functions} />)
      .build();
  };

  const createHeaderDecimal = () => {
    return DatatableOption.Builder.builder().key("decimals").name("Decimals").width(110).build();
  };

  const createHeaderTotalSupply = () => {
    return DatatableOption.Builder.builder()
      .key("packagePath")
      .name("Total Supply")
      .width(180)
      .renderOption(packagePath => <DatatableItem.LazyTotalSupply realmPath={packagePath} maxSize="p4" minSize="p4" />)
      .build();
  };

  const createHeaderPkgPath = () => {
    return DatatableOption.Builder.builder()
      .key("packagePath")
      .name("Path")
      .width(176)
      .colorName("blue")
      .tooltip(TOOLTIP_PACAKGE_PATH)
      .renderOption(packagePath => <DatatableItem.RealmPackage packagePath={packagePath} maxWidth={160} />)
      .build();
  };

  if (!isFetched) return <TableSkeleton />;

  return (
    <S.Container>
      <Datatable
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={tokens}
        supported={!!indexerQueryClient}
      />
      {hasNextPage ? (
        <div className="button-wrapper">
          <Button className={`more-button ${breakpoint}`} radius={"4px"} onClick={() => nextPage()}>
            {"View More Tokens"}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </S.Container>
  );
};
