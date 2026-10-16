"use client";
import React from "react";
import BigNumber from "bignumber.js";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { TokenListSortOption } from "@/common/types/token";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "../../../datatable";
import { ViewMoreButton } from "@/components/ui/button";
import TableSkeleton from "../../../common/table-skeleton/TableSkeleton";
import { GRC20InfoWithLogo } from "@/common/mapper/token/token-mapper";
import { formatTokenDecimal } from "@/common/utils/token.utility";
import { GRC20_REGISTRY_PATH } from "@/common/values/constant-value";
import { formatUsd, formatUsdWhole } from "@/common/utils/price.utility";
import { getTokenMarketCap, toTokenKey } from "@/common/utils/sort/token-list-sort";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";
import Text from "@/components/ui/text";
import { PriceChangeText } from "@/components/ui/text/price-change-text";
import { CardTableContainer } from "@/components/view/datatable/datatable.styles";
import * as S from "./StandardNetworkTokenListTable.styles";

interface TokenListTableProps {
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
  data,
  hasNextPage,
  isFetched,
  fetchNextPage,
  sortOption,
  setSortOption,
}: TokenListTableProps) => {
  const { indexerQueryClient } = useNetworkProvider();

  const { getPriceEntry } = useTokenPrice();

  const createHeaders = () => {
    return [
      createHeaderToken(),
      createHeaderPrice(),
      createHeaderMarketCap(),
      createHeaderHolder(),
      createHeaderTransfers(),
      createHeaderTotalSupply(),
      createHeaderPkgPath(),
      createHeaderRegistered(),
    ];
  };

  const createHeaderToken = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("token")
      .name("Token")
      .width(219)
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

  const createHeaderPrice = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("price")
      .name("Price (24h)")
      .width(131)
      .renderOption((_, data) => {
        const entry = getPriceEntry(toTokenKey(data));
        const price = entry ? formatUsd(entry.price) : null;
        if (!price) return <>-</>;
        return (
          <S.PriceCell>
            {price}
            <PriceChangeText change={entry?.changeRateOneDay} />
          </S.PriceCell>
        );
      })
      .build();
  };

  const createHeaderMarketCap = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("marketCap")
      .name("Market Cap")
      .sort()
      .width(128)
      .renderOption((_, data) => <>{formatUsdWhole(getTokenMarketCap(data, getPriceEntry)) ?? "-"}</>)
      .build();
  };

  const createHeaderHolder = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("holders")
      .name("Holders")
      .sort()
      .width(106)
      .renderOption(holders => <>{makeDisplayNumber(holders)}</>)
      .build();
  };

  const createHeaderTransfers = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("transfers24h")
      .name("Transfers (24h)")
      .sort()
      .width(152)
      .renderOption((_, data) => (
        <>{data.transactionCount24h === null ? "-" : makeDisplayNumber(data.transactionCount24h)}</>
      ))
      .build();
  };

  const createHeaderTotalSupply = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("totalSupply")
      .name("Total Supply")
      .sort()
      .width(133)
      .renderOption((_, data) => (
        <>
          {BigNumber(formatTokenDecimal(data.totalSupply, data.decimals)).integerValue(BigNumber.ROUND_DOWN).toFormat()}
        </>
      ))
      .build();
  };

  const createHeaderPkgPath = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("packagePath")
      .name("Path")
      .width(140)
      .colorName("blue")
      .renderOption((packagePath, data) =>
        packagePath ? (
          <DatatableItem.RealmPackage packagePath={packagePath} maxWidth={108} truncateStart />
        ) : (
          <>{data.symbol}</>
        ),
      )
      .build();
  };

  // Token, Price and Path give up width so the full registry path and every sort icon fit.
  const createHeaderRegistered = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("registered")
      .name("Registered")
      .width(137)
      .colorName("blue")
      .renderOption((_, data) =>
        data.registered ? (
          <DatatableItem.RealmPackage packagePath={GRC20_REGISTRY_PATH} maxWidth={105} />
        ) : (
          <Text type="p4" color="primary">
            -
          </Text>
        ),
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
          <ViewMoreButton variant="table" text="View More Tokens" onClick={() => fetchNextPage()} />
        </div>
      )}
    </CardTableContainer>
  );
};
