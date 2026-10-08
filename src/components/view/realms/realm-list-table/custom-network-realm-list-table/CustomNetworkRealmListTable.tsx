/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { RealmListSortOption } from "@/common/types/realm";
import { Realm } from "@/types/data-type";

import { CardTableContainer } from "@/components/view/datatable/datatable.styles";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "../../../datatable";
import { ViewMoreButton } from "@/components/ui/button";
import TableSkeleton from "../../../common/table-skeleton/TableSkeleton";

const TOOLTIP_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

interface RealmListTableProps {
  sortOption: RealmListSortOption;
  realms: Realm[];
  isFetched: boolean;
  hasNextPage?: boolean;
  isDefault: boolean;
  defaultFromHeight: number | null;
  fetchNextPage: () => void;
  setSortOption: (sortOption: RealmListSortOption) => void;
  getName: (address: string) => string;
}

export const CustomNetworkRealmListTable = ({
  sortOption,
  setSortOption,
  realms,
  isFetched,
  hasNextPage,
  fetchNextPage,
  isDefault,
  defaultFromHeight,
  getName,
}: RealmListTableProps) => {
  const { indexerQueryClient } = useNetworkProvider();

  const createHeaders = () => {
    return [
      createHeaderName(),
      createHeaderPath(),
      createHeaderFunctions(),
      createHeaderBlock(),
      createHeaderPublisher(),
      createHeaderTotalCalls(),
      createHeaderTotalGasUsed(),
    ];
  };

  const createHeaderName = () => {
    return DatatableOption.Builder.builder().key("packageName").name("Name").sort().width(174).build();
  };

  const createHeaderPath = () => {
    return DatatableOption.Builder.builder()
      .key("packagePath")
      .name("Path")
      .width(202) // removed functions column
      .colorName("blue")
      .tooltip(TOOLTIP_PATH)
      .renderOption(packagePath => <DatatableItem.RealmPackage packagePath={packagePath} maxWidth={186} />)
      .build();
  };

  const createHeaderFunctions = () => {
    return DatatableOption.Builder.builder()
      .key("packagePath")
      .name("Functions")
      .width(121)
      .renderOption(packagePath => <DatatableItem.LazyFunctions realmPath={packagePath} />)
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder()
      .key("blockHeight")
      .name("Block")
      .sort()
      .width(121)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderPublisher = () => {
    return DatatableOption.Builder.builder()
      .key("creator")
      .name("Publisher")
      .width(202)
      .colorName("blue")
      .renderOption(creator => <DatatableItem.Publisher address={creator} username={getName(creator)} />)
      .build();
  };

  const createHeaderTotalCalls = () => {
    return DatatableOption.Builder.builder()
      .key("totalCalls")
      .name("Total Calls")
      .sort()
      .width(163)
      .renderOption((_, data: any) => (
        <DatatableItem.LazyTotalCalls
          packagePath={data?.packagePath}
          isDefault={isDefault}
          defaultFromHeight={defaultFromHeight}
        />
      ))
      .build();
  };

  const createHeaderTotalGasUsed = () => {
    return DatatableOption.Builder.builder()
      .key("packagePath")
      .name("Total Gas Used")
      .width(163)
      .renderOption(packagePath => (
        <DatatableItem.LazyFeeAmount
          packagePath={packagePath}
          isDefault={isDefault}
          defaultFromHeight={defaultFromHeight}
        />
      ))
      .build();
  };

  if (!isFetched) return <TableSkeleton />;

  return (
    <CardTableContainer>
      <Datatable
        headers={createHeaders()}
        datas={realms || []}
        sortOption={sortOption}
        setSortOption={setSortOption}
        supported={!!indexerQueryClient}
      />

      {hasNextPage && (
        <div className="button-wrapper">
          <ViewMoreButton variant="table" text="View More Realms" onClick={() => fetchNextPage()} />
        </div>
      )}
    </CardTableContainer>
  );
};
