"use client";
import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { TokenListSortOption } from "@/common/types/token";

import { CardTableContainer } from "@/components/view/datatable/datatable.styles";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "../../../datatable";
import { ViewMoreButton } from "@/components/ui/button";
import TableSkeleton from "../../../common/table-skeleton/TableSkeleton";
import { GRC20InfoWithLogo } from "@/common/mapper/token/token-mapper";
import { formatTokenDecimal } from "@/common/utils/token.utility";

const TOOLTIP_PACAKGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

interface TokenListTableProps {
  breakpoint: DEVICE_TYPE;
  data: GRC20InfoWithLogo[];
  hasNextPage?: boolean;
  isFetched: boolean;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  sortOption: TokenListSortOption;
  setSortOption: (sortOption: TokenListSortOption) => void;
}

export const StandardNetworkTokenListTable = ({
  breakpoint,
  data,
  hasNextPage,
  isFetched,
  fetchNextPage,
  sortOption,
  setSortOption,
}: TokenListTableProps) => {
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
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("token")
      .name("Token")
      .width(220)
      .renderOption((_, data) => (
        <DatatableItem.StandardNetworkTokenTitle
          token={data.symbol}
          imagePath={data.logoUrl}
          name={data.name}
          symbol={data.symbol}
          pkgPath={data.packagePath}
        />
      ))
      .build();
  };

  const createHeaderHolder = () => {
    return DatatableOption.Builder.builder().key("holders").name("Holders").width(110).build();
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
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("totalSupply")
      .name("Total Supply")
      .width(180)
      .renderOption((_, data) => <>{makeDisplayNumber(formatTokenDecimal(data.totalSupply, data.decimals))}</>)
      .build();
  };

  const createHeaderPkgPath = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("packagePath")
      .name("Path")
      .width(176)
      .colorName("blue")
      .tooltip(TOOLTIP_PACAKGE_PATH)
      .renderOption((packagePath, data) =>
        packagePath ? <DatatableItem.RealmPackage packagePath={packagePath} maxWidth={160} /> : <>{data.symbol}</>,
      )
      .build();
  };

  if (!isFetched) return <TableSkeleton />;

  return (
    <CardTableContainer>
      <Datatable
        headers={createHeaders()}
        datas={data}
        sortOption={sortOption}
        setSortOption={setSortOption}
        supported={!!indexerQueryClient}
      />
      {hasNextPage && (
        <div className="button-wrapper">
          <ViewMoreButton
            variant="table"
            breakpoint={breakpoint}
            text="View More Tokens"
            onClick={() => fetchNextPage()}
          />
        </div>
      )}
    </CardTableContainer>
  );
};
