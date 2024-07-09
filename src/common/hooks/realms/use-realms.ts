import {useGetRealmTransactionInfosQuery, useGetRealmsQuery} from '@/common/react-query/realm';
import {makeDisplayNumberWithDefault} from '@/common/utils/string-util';
import {useMemo, useState} from 'react';
import {GNOTToken, useTokenMeta} from '../common/use-token-meta';

export const useRealms = () => {
  const {getTokenAmount} = useTokenMeta();
  const {data, isFetched} = useGetRealmsQuery();
  const {data: realmTransactionInfos, isFetched: isFetchedRealmTransactionInfos} =
    useGetRealmTransactionInfosQuery();
  const [currentPage, setCurrentPage] = useState(0);

  const hasNextPage = useMemo(() => {
    if (!data) {
      return false;
    }

    return data.length > (currentPage + 1) * 20;
  }, [currentPage, data?.length]);

  const realms = useMemo(() => {
    if (!data || !realmTransactionInfos) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = data.length > nextIndex ? nextIndex : data.length;
    return data
      .filter((_: any, index: number) => index < endIndex)
      .map((realm: any) => ({
        ...realm,
        totalCalls: realmTransactionInfos[realm.packagePath]?.msgCallCount || '0',
        totalGasUsed: getTokenAmount(
          GNOTToken.denom,
          realmTransactionInfos[realm.packagePath].gasUsed,
        ),
      }));
  }, [data, realmTransactionInfos, currentPage, getTokenAmount]);

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    realms,
    isFetched: isFetched && isFetchedRealmTransactionInfos,
    nextPage,
    hasNextPage,
  };
};
