import {useGetRealmTransactionInfosQuery, useGetRealmsQuery} from '@/common/react-query/realm';
import {useMemo, useState} from 'react';
import {GNOTToken, useTokenMeta} from '../common/use-token-meta';

export const useRealms = (paging = true) => {
  const {getTokenAmount} = useTokenMeta();
  const {data, isFetched} = useGetRealmsQuery();
  const {data: realmTransactionInfos, isFetched: isFetchedRealmTransactionInfos} =
    useGetRealmTransactionInfosQuery();
  const [currentPage, setCurrentPage] = useState(0);

  const hasNextPage = useMemo(() => {
    if (!data || !paging) {
      return false;
    }

    return data.length > (currentPage + 1) * 20;
  }, [currentPage, data, paging]);

  const realms = useMemo(() => {
    if (!data || !realmTransactionInfos) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = data.length > nextIndex ? nextIndex : data.length;
    const filteredData = paging ? data.filter((_: any, index: number) => index < endIndex) : data;

    return filteredData.map((realm: any) => ({
      ...realm,
      totalCalls: realmTransactionInfos[realm.packagePath]?.msgCallCount || '0',
      totalGasUsed: getTokenAmount(
        GNOTToken.denom,
        realmTransactionInfos[realm.packagePath]?.gasUsed || 0,
      ),
    }));
  }, [data, realmTransactionInfos, currentPage, paging, getTokenAmount]);

  function nextPage() {
    if (!paging) {
      return;
    }
    setCurrentPage(prev => prev + 1);
  }

  return {
    realms,
    isFetched: isFetched && isFetchedRealmTransactionInfos,
    nextPage,
    hasNextPage,
  };
};
