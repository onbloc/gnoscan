/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useRecoilValue } from "recoil";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { themeState } from "@/states";
import { RealmListSortOption } from "@/common/types/realm";
import { Realm } from "@/types/data-type";
import { toGNOTAmount } from "@/common/utils/native-token-utility";

import * as S from "./StandardNetworkRealmListTable.styles";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "../../../datatable";
import { Button } from "@/components/ui/button";
import TableSkeleton from "../../../common/table-skeleton/TableSkeleton";
import { AmountText } from "@/components/ui/text/amount-text";
import { StorageUsageText } from "@/components/ui/text/storage-usage-text";

const TOOLTIP_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

interface RealmListTableProps {
  breakpoint: DEVICE_TYPE;
  sortOption: RealmListSortOption;
  realms: Realm[];
  isFetched: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  setSortOption: (sortOption: RealmListSortOption) => void;
}

export const StandardNetworkRealmListTable = ({
  breakpoint,
  sortOption,
  setSortOption,
  realms,
  isFetched,
  hasNextPage,
  fetchNextPage,
}: RealmListTableProps) => {
  const themeMode = useRecoilValue(themeState);
  const { indexerQueryClient } = useNetworkProvider();

  if (!isFetched) return <TableSkeleton />;

  const createHeaders = () => {
    return [
      createHeaderName(),
      createHeaderPath(),
      createHeaderBlock(),
      createHeaderPublisher(),
      createHeaderTotalCalls(),
      createHeaderTotalGasUsed(),
      createHeaderStorageUsage(),
    ];
  };

  const createHeaderName = () => {
    return DatatableOption.Builder.builder().key("packageName").name("Name").sort().width(174).build();
  };

  const createHeaderPath = () => {
    return DatatableOption.Builder.builder<Realm>()
      .key("packagePath")
      .name("Path")
      .width(202) // removed functions column
      .colorName("blue")
      .tooltip(TOOLTIP_PATH)
      .renderOption(packagePath => <DatatableItem.RealmPackage packagePath={packagePath} maxWidth={186} />)
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<Realm>()
      .key("blockHeight")
      .name("Block")
      .width(121)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderPublisher = () => {
    return DatatableOption.Builder.builder<Realm>()
      .key("creator")
      .name("Publisher")
      .width(202)
      .colorName("blue")
      .renderOption((_, data) => <DatatableItem.Publisher address={data.creator} username={data.creatorName} />)
      .build();
  };

  const createHeaderTotalCalls = () => {
    return DatatableOption.Builder.builder<Realm>().key("totalCalls").name("Total Calls").sort().width(163).build();
  };

  const createHeaderTotalGasUsed = () => {
    return DatatableOption.Builder.builder<Realm>()
      .key("totalGasUsed")
      .name("Total Gas Used")
      .width(163)
      .renderOption(gasUsed => {
        console.log(gasUsed, "gasUsed?");
        return <AmountText {...toGNOTAmount(gasUsed.value, gasUsed.denom)} maxSize="p4" minSize="body1" />;
      })
      .build();
  };

  const createHeaderStorageUsage = () => {
    return DatatableOption.Builder.builder<Realm>()
      .key("storageUsage")
      .name("Storage Usage")
      .sort()
      .width(210)
      .renderOption(storageUsed => {
        const dummy = { denom: "ugnot", value: "51212111", sizeInBytes: 16360 };
        return (
          <StorageUsageText
            {...toGNOTAmount(dummy.value, dummy.denom)}
            sizeInBytes={dummy.sizeInBytes}
            minSize="body1"
            maxSize="p4"
          />
        );
      })
      .build();
  };

  return (
    <S.Container>
      <Datatable
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={realms || []}
        sortOption={sortOption}
        setSortOption={setSortOption}
        supported={!!indexerQueryClient}
      />

      {hasNextPage ? (
        <div className="button-wrapper">
          <Button className={`more-button ${breakpoint}`} radius={"4px"} onClick={() => fetchNextPage()}>
            {"View More Realms"}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </S.Container>
  );
};
