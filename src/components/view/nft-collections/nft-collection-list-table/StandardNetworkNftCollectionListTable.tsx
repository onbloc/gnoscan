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
      .key("standardPackage")
      .name("NFT Standard")
      .width(179)
      .colorName("blue")
      .renderOption((_, data) => <DatatableItem.LazyNftStandard tokenKey={data.tokenId} />)
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

// Keep the table inset; header colors inherit the shared Realms/Tokens treatment.
const CollectionTableContainer = styled(CardTableContainer)`
  && {
    > div:first-child {
      padding: 24px 24px 0;

      .scroll-wrapper > div:first-child {
        border-color: ${({ theme }) => theme.colors.dimmed100};

        > div {
          padding-top: 12px;
          padding-bottom: 12px;
          line-height: 16px;
        }
      }
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
