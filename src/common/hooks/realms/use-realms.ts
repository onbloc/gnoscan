import {useGetRealmsQuery, useGetRealmTransactionInfosQuery} from '@/common/react-query/realm';
import {useEffect, useMemo, useState} from 'react';
import {GNOTToken, useTokenMeta} from '../common/use-token-meta';

export const useRealms = (
  paging = true,
  sortOptions?: {
    field: string;
    order: string;
  },
) => {
  const {getTokenAmount} = useTokenMeta();
  const {data, isFetched} = useGetRealmsQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const {data: realmTransactionInfos, isFetched: isFetchedRealmTransactionInfos} =
    useGetRealmTransactionInfosQuery();

  const hasNextPage = useMemo(() => {
    if (!data || !paging) {
      return false;
    }

    return data.length > (currentPage + 1) * 20;
  }, [currentPage, data, paging]);

  const dataWithTransactionInfo = useMemo(() => {
    if (!data || !realmTransactionInfos) {
      return data;
    }

    return data.map((realm: any) => ({
      ...realm,
      totalCalls: realmTransactionInfos?.[realm.packagePath]?.msgCallCount || 0,
      totalGasUsed: getTokenAmount(
        GNOTToken.denom,
        realmTransactionInfos?.[realm.packagePath]?.gasUsed || 0,
      ),
    }));
  }, [data, realmTransactionInfos]);

  const sortedData = useMemo(() => {
    if (!data) {
      return null;
    }

    if (!sortOptions || sortOptions.order === 'none') {
      return data;
    }

    if (sortOptions.field === 'totalCalls') {
      console.log(realmTransactionInfos);
      return dataWithTransactionInfo?.sort(sort) || null;
    }

    return data.sort(sort);
  }, [data, realmTransactionInfos, sortOptions]);

  const realms = useMemo(() => {
    if (!sortedData) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = sortedData.length > nextIndex ? nextIndex : sortedData.length;
    const filteredData = paging
      ? sortedData.filter((_: any, index: number) => index < endIndex)
      : sortedData;

    return filteredData;
  }, [sortedData, currentPage, paging, sortOptions]);

  function sort(data1: any, data2: any) {
    if (!sortOptions || sortOptions.field === 'none') {
      return 0;
    }

    if (sortOptions?.field === 'packageName') {
      if (sortOptions.order === 'desc') {
        return data1.packageName < data2.packageName ? 1 : -1;
      }
      return data1.packageName > data2.packageName ? 1 : -1;
    }

    if (sortOptions?.field === 'totalCalls') {
      if (sortOptions.order === 'desc') {
        return Number(data2?.totalCalls) - Number(data1?.totalCalls);
      }
      return Number(data1?.totalCalls) - Number(data2?.totalCalls);
    }
    return 0;
  }

  function nextPage() {
    if (!paging) {
      return;
    }
    setCurrentPage(prev => prev + 1);
  }

  useEffect(() => {
    setCurrentPage(0);
  }, [sortOptions]);

  return {
    realms,
    realmTransactionInfos,
    isFetched: isFetched,
    isFetchedRealmTransactionInfos,
    nextPage,
    hasNextPage,
  };
};
