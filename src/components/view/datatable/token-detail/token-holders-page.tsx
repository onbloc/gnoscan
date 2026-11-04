/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "..";
import { FlushTableContainer } from "../datatable.styles";
import { useGetTokenHoldersByid, useGetTokenById } from "@/common/react-query/token/api";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { TokenHolderModel } from "@/models/api/token/token-holder-model";
import { formatTokenDecimal } from "@/common/utils/token.utility";
import { getAddressNameTag } from "@/common/utils/address-label.utility";

import { TokenHolder } from "@/types/data-type";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";
import { ListPagination } from "../../common/list-pagination/ListPagination";

interface Props {
  path: string[] | any;
}

export const TokenHoldersDatatablePage = ({ path }: Props) => {
  const { data: tokenData } = useGetTokenById(path);
  const { getTokenMeta } = useTokenResourceMeta();
  const backendMeta = tokenData?.data ?? { decimals: 0, symbol: "" };
  const resolved = tokenData?.data?.path
    ? getTokenMeta(tokenData.data.tokenId || tokenData.data.path, {
        name: tokenData.data.name,
        symbol: tokenData.data.symbol,
        decimals: tokenData.data.decimals,
      })
    : undefined;
  const decimals = resolved?.decimals ?? backendMeta.decimals;
  const symbol = resolved?.symbol ?? backendMeta.symbol;

  const [page, setPage] = useListPagination("token-holders", String(path));
  const { data, isFetched: isFetchedHolders, isPreviousData } = useGetTokenHoldersByid({ path, page });

  const tokenHolders: TokenHolder[] = React.useMemo(() => {
    if (!data) return [];

    return data.items.map((item: TokenHolderModel, index: number): TokenHolder => {
      return {
        rank: (page - 1) * DEFAULT_LIST_ITEMS_SIZE + index + 1,
        address: item.address,
        nameTag: getAddressNameTag(item),
        label: item.label,
        labelType: item.labelType,
        balance: {
          value: formatTokenDecimal(item.balance, decimals),
          denom: symbol,
        },
        percentage: item.percentage,
      };
    });
  }, [data, page, decimals, symbol]);

  // Rows of the previous page stay on screen while the next page loads.
  const isReady = isFetchedHolders || isPreviousData;

  if (!isReady) return <TableSkeleton />;

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
      .renderOption((_, data) => (
        <DatatableItem.AddressCopy address={data.address} label={data.label} labelType={data.labelType} />
      ))
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
    <FlushTableContainer>
      <Datatable loading={!isReady} headers={createHeaders()} datas={tokenHolders as TokenHolder[]} />
      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_ITEMS_SIZE}
        totalCount={data?.page.totalCount}
        hasNext={data?.page.hasNext}
        isSettled={!isPreviousData}
        scope={String(path)}
        onChangePage={setPage}
      />
    </FlushTableContainer>
  );
};
