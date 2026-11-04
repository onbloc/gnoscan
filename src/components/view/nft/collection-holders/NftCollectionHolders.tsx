import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useGetRealmHoldersByPath } from "@/common/react-query/realm/api";
import { getAddressNameTag } from "@/common/utils/address-label.utility";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { DEFAULT_LIST_ITEMS_SIZE } from "@/common/values/query.constant";
import type { RealmHolderModel } from "@/repositories/api/realm/response";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "../../datatable";
import { FlushTableContainer } from "../../datatable/datatable.styles";
import { ListPagination } from "../../common/list-pagination/ListPagination";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

type NftHolderRow = Omit<RealmHolderModel, "nameTag"> & {
  rank: number;
  nameTag: string | null;
};

const HEADERS = [
  DatatableOption.Builder.builder<NftHolderRow>()
    .key("rank")
    .name("#")
    .width(80)
    .renderOption(rank => <span>{rank}</span>)
    .build(),
  DatatableOption.Builder.builder<NftHolderRow>()
    .key("address")
    .name("Address")
    .width(275)
    .colorName("blue")
    .renderOption((_, row) => (
      <DatatableItem.AddressCopy address={row.address} label={row.label} labelType={row.labelType} />
    ))
    .build(),
  DatatableOption.Builder.builder<NftHolderRow>()
    .key("nameTag")
    .name("Name Tag")
    .width(260)
    .renderOption(nameTag => <span>{nameTag || "-"}</span>)
    .build(),
  DatatableOption.Builder.builder<NftHolderRow>()
    .key("tokenCount")
    .name("Owned")
    .width(288)
    .renderOption(tokenCount => <span>{makeDisplayNumber(tokenCount)}</span>)
    .build(),
  DatatableOption.Builder.builder<NftHolderRow>()
    .key("percentage")
    .name("Percentage")
    .width(243)
    .renderOption(percentage => <span>{percentage.toFixed(4)}%</span>)
    .build(),
];

interface NftCollectionHoldersProps {
  tokenKey: string;
}

const NftCollectionHolders = ({ tokenKey }: NftCollectionHoldersProps) => {
  const [page, setPage] = useListPagination("nft-holders", tokenKey);
  const { data, isFetched, isPreviousData } = useGetRealmHoldersByPath({ path: tokenKey, page });

  const holders = React.useMemo(
    () =>
      data?.items.map(
        (item, index): NftHolderRow => ({
          ...item,
          rank: (page - 1) * DEFAULT_LIST_ITEMS_SIZE + index + 1,
          nameTag: getAddressNameTag(item),
        }),
      ) ?? [],
    [data?.items, page],
  );

  if (!isFetched) return <TableSkeleton />;

  return (
    <FlushTableContainer>
      <Datatable headers={HEADERS} datas={holders} />
      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_ITEMS_SIZE}
        totalCount={data?.page.totalCount}
        hasNext={data?.page.hasNext}
        isSettled={!isPreviousData}
        scope={tokenKey}
        onChangePage={setPage}
      />
    </FlushTableContainer>
  );
};

export default NftCollectionHolders;
