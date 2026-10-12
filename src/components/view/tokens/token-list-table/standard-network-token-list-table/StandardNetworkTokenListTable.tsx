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
import { formatUsd, formatUsdWhole, getUsdValue } from "@/common/utils/price.utility";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";
import { PriceChangeText } from "@/components/ui/text/price-change-text";
import * as S from "./StandardNetworkTokenListTable.styles";

const toTokenKey = (data: GRC20InfoWithLogo) => (data.symbol ? `${data.packagePath}.${data.symbol}` : data.packagePath);

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
      .width(229)
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
      .width(145)
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
      .width(136)
      .renderOption((_, data) => {
        const price = getPriceEntry(toTokenKey(data))?.price;
        const marketCap = price ? getUsdValue(formatTokenDecimal(data.totalSupply, data.decimals), price) : null;
        return <>{formatUsdWhole(marketCap) ?? "-"}</>;
      })
      .build();
  };

  const createHeaderHolder = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("holders")
      .name("Holders")
      .width(100)
      .renderOption(holders => <>{makeDisplayNumber(holders)}</>)
      .build();
  };

  // ponytail: the API has no 24h transfer count yet, so this shows "-" until it does.
  const createHeaderTransfers = () => {
    return DatatableOption.Builder.builder()
      .key("transfers24h")
      .name("Transfers (24h)")
      .width(129)
      .renderOption(() => <>-</>)
      .build();
  };

  const createHeaderTotalSupply = () => {
    return DatatableOption.Builder.builder<GRC20InfoWithLogo>()
      .key("totalSupply")
      .name("Total Supply")
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
      .width(174)
      .colorName("blue")
      .renderOption((packagePath, data) =>
        packagePath ? <DatatableItem.RealmPackage packagePath={packagePath} maxWidth={142} /> : <>{data.symbol}</>,
      )
      .build();
  };

  // ponytail: the API does not report grc20reg registration yet, so this shows "-" until it does.
  const createHeaderRegistered = () => {
    return DatatableOption.Builder.builder()
      .key("registered")
      .name("Registered")
      .width(100)
      .renderOption(() => <>-</>)
      .build();
  };

  if (!isFetched) return <TableSkeleton />;

  return (
    <S.TokenListTable>
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
    </S.TokenListTable>
  );
};
