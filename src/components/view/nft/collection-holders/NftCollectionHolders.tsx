import React from "react";

import { useGetNftCollectionHolders } from "@/common/react-query/token/api";
import { getAddressNameTag } from "@/common/utils/address-label.utility";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

import { ViewMoreButton } from "@/components/ui/button";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "../../datatable";
import { FlushTableContainer } from "../../datatable/datatable.styles";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface NftHolderRow {
  rank: number;
  address: string;
  nameTag?: string | null;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
  tokenCount: number;
  percentage: number;
}

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
    .name("Quantity")
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
  const { data, isFetched, hasNextPage, fetchNextPage } = useGetNftCollectionHolders({ tokenKey });

  const holders = React.useMemo(
    () =>
      data?.pages
        .flatMap(page => page.items)
        .map(
          (item, index): NftHolderRow => ({
            rank: index + 1,
            address: item.address,
            nameTag: getAddressNameTag(item),
            label: item.label,
            labelType: item.labelType,
            tokenCount: item.tokenCount,
            percentage: item.percentage,
          }),
        ) ?? [],
    [data?.pages],
  );

  if (!isFetched) return <TableSkeleton />;

  return (
    <FlushTableContainer>
      <Datatable loading={!isFetched} headers={HEADERS} datas={holders} />
      {hasNextPage && <ViewMoreButton variant="table" text="View More Holders" onClick={() => fetchNextPage()} />}
    </FlushTableContainer>
  );
};

export default NftCollectionHolders;
