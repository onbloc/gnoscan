"use client";
import React from "react";
import styled from "styled-components";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { NftCollectionListSortOption } from "@/common/types/token";
import { NftCollectionModel } from "@/repositories/api/token/response";
import { media } from "@/common/values/ui.constant";

import { CardTableContainer } from "@/components/view/datatable/datatable.styles";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "../../datatable";
import { ViewMoreButton } from "@/components/ui/button";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface NftCollectionListTableProps {
  data: NftCollectionModel[];
  hasNextPage?: boolean;
  isFetched: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
  sortOption: NftCollectionListSortOption;
  setSortOption: (sortOption: NftCollectionListSortOption) => void;
}

export const StandardNetworkNftCollectionListTable = ({
  data,
  hasNextPage,
  isFetched,
  fetchNextPage,
  sortOption,
  setSortOption,
}: NftCollectionListTableProps) => {
  const { indexerQueryClient } = useNetworkProvider();

  const headers = [
    DatatableOption.Builder.builder<NftCollectionModel>()
      .key("name")
      .name("Collection Name")
      .width(229)
      .renderOption((_, data) => <DatatableItem.NftCollectionTitle tokenId={data.tokenId} name={data.name} />)
      .build(),
    DatatableOption.Builder.builder().key("symbol").name("Symbol").width(159).build(),
    DatatableOption.Builder.builder().key("holders").name("Holders").width(102).build(),
    DatatableOption.Builder.builder().key("transfers").name("Transfers").width(106).build(),
    DatatableOption.Builder.builder<NftCollectionModel>()
      .key("totalSupply")
      .name("Total Supply")
      .width(134)
      .renderOption((_, data) => <>{makeDisplayNumber(data.totalSupply)}</>)
      .build(),
    DatatableOption.Builder.builder<NftCollectionModel>()
      .key("path")
      .name("Path")
      .width(237)
      .colorName("blue")
      .renderOption(path => <DatatableItem.RealmPackage packagePath={path} maxWidth={205} addressVisibleLength={8} />)
      .build(),
    DatatableOption.Builder.builder<NftCollectionModel>()
      .key("owner")
      .name("Publisher")
      .width(179)
      .colorName("blue")
      .renderOption((_, data) => (
        <DatatableItem.Publisher
          address={data.owner}
          username={undefined}
          label={data.ownerLabel}
          labelType={data.ownerLabelType}
        />
      ))
      .build(),
  ];

  if (!isFetched) return <TableSkeleton />;

  return (
    <CollectionTableContainer>
      <Datatable
        headers={headers}
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
    </CollectionTableContainer>
  );
};

// Scope the Figma collection-table geometry without changing other datatables.
const CollectionTableContainer = styled(CardTableContainer)`
  && {
    padding: 24px;

    > div:first-child {
      padding: 0;
    }

    .scroll-wrapper > div:first-child {
      height: 40px;

      > div {
        padding: 12px 16px;
        line-height: 16px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.nftTableHeader};
      }
    }

    .scroll-wrapper > div:first-child,
    .scroll-wrapper > div:nth-child(2) > div {
      border-bottom: 0;
      box-shadow: inset 0 -1px 0 ${({ theme }) => theme.colors.dimmed100};
    }

    .scroll-wrapper > div:nth-child(2) {
      border-bottom: 0;
    }

    .row > div {
      height: auto;
      align-self: stretch;
    }

    .button-wrapper {
      margin-top: 24px;
      padding: 0;
    }

    .view-more-button {
      ${media.DESKTOP} {
        width: 308px;
        padding: 16px 96px;
      }
    }
  }
`;
