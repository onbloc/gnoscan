/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetRealmPackagesInfinity,
  useGetRealmsQuery,
  useGetRealmTransactionInfosByFromHeightQuery,
  useGetRealmTransactionInfosQuery,
} from "@/common/react-query/realm";
import { useEffect, useMemo, useState } from "react";
import { GNOTToken, useTokenMeta } from "../common/use-token-meta";
import { useNetworkProvider } from "../provider/use-network-provider";
import { RealmListSortOption } from "@/common/types/realm";

export const useRealms = (paging = true, sortOptions?: RealmListSortOption) => {
  const { isCustomNetwork } = useNetworkProvider();
  const { getTokenAmount } = useTokenMeta();
  const {
    data: defaultData,
    isFetched: isFetchedDefault,
    hasNextPage: hasNextPageDefault,
    fetchNextPage,
  } = useGetRealmPackagesInfinity({ enabled: !isCustomNetwork });

  const defaultFromHeight = useMemo(() => {
    if (!defaultData) {
      return null;
    }

    const transactions = defaultData?.pages?.flatMap(page => page?.transactions || []);
    if (transactions.length === 0) {
      return null;
    }

    return Number(transactions?.[transactions.length - 1]?.blockHeight || 0) || null;
  }, [defaultData]);

  const { isFetched: isFetchedDefaultRealmTransactionInfo } = useGetRealmTransactionInfosByFromHeightQuery(
    defaultFromHeight,
    {
      enabled: !!defaultFromHeight,
    },
  );

  const { data, isFetched: isFetchedAll } = useGetRealmsQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const { data: realmTransactionInfos, isFetched: isFetchedRealmTransactionInfos } = useGetRealmTransactionInfosQuery();

  const isDefault = useMemo(() => {
    if (isCustomNetwork) {
      return false;
    }

    if (!sortOptions) {
      return true;
    }

    return sortOptions.field === "none" && sortOptions.order === "none";
  }, [isCustomNetwork, isFetchedAll, sortOptions]);

  const isFetched = useMemo(() => {
    if (isDefault) {
      return isFetchedDefault;
    }

    return isFetchedAll;
  }, [isDefault, isFetchedAll, isFetchedDefault]);

  const hasNextPage = useMemo(() => {
    if (isDefault) {
      return hasNextPageDefault;
    }

    if (!data || !paging) {
      return false;
    }

    return data.length > (currentPage + 1) * 20;
  }, [isDefault, data, paging, currentPage, hasNextPageDefault]);

  const dataWithTransactionInfo = useMemo(() => {
    if (!data || !realmTransactionInfos) {
      return data;
    }

    return data.map((realm: any) => ({
      ...realm,
      totalCalls: realmTransactionInfos?.[realm.packagePath]?.msgCallCount || 0,
      totalGasUsed: getTokenAmount(GNOTToken.denom, realmTransactionInfos?.[realm.packagePath]?.gasUsed || 0),
    }));
  }, [data, realmTransactionInfos]);

  const sortedData = useMemo(() => {
    if (!data) {
      return null;
    }

    if (!sortOptions || sortOptions.order === "none") {
      return data;
    }

    if (sortOptions.field === "totalCalls") {
      return dataWithTransactionInfo?.sort(sort) || null;
    }

    return data.sort(sort);
  }, [data, realmTransactionInfos, sortOptions]);

  const realms = useMemo(() => {
    if (isDefault) {
      return defaultData?.pages?.flatMap(page => page?.transactions || []) || [];
    }

    if (!sortedData) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = sortedData.length > nextIndex ? nextIndex : sortedData.length;
    const filteredData = paging ? sortedData.filter((_: any, index: number) => index < endIndex) : sortedData;

    return filteredData;
  }, [isDefault, sortedData, currentPage, paging, defaultData?.pages]);

  function sort(data1: any, data2: any) {
    if (!sortOptions || sortOptions.field === "none") {
      return 0;
    }

    if (sortOptions?.field === "packageName") {
      if (sortOptions.order === "desc") {
        return data1.packageName < data2.packageName ? 1 : -1;
      }
      return data1.packageName > data2.packageName ? 1 : -1;
    }

    if (sortOptions?.field === "totalCalls") {
      if (sortOptions.order === "desc") {
        return Number(data2?.totalCalls) - Number(data1?.totalCalls);
      }
      return Number(data1?.totalCalls) - Number(data2?.totalCalls);
    }
    return 0;
  }

  function nextPage() {
    if (!paging) {
      setCurrentPage(prev => prev + 1);
      return;
    }
    fetchNextPage();
  }

  useEffect(() => {
    setCurrentPage(0);
  }, [sortOptions]);

  return {
    isDefault,
    realms,
    realmTransactionInfos: realmTransactionInfos,
    isFetched,
    isFetchedRealmTransactionInfos,
    isFetchedDefaultRealmTransactionInfo,
    defaultFromHeight,
    nextPage,
    hasNextPage,
  };
};
