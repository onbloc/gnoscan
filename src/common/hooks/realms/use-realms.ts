import {
  useGetRealmTransactionInfosQuery,
  useGetRealmTransactionsQuery,
  useGetRealmsQuery,
} from '@/common/react-query/realm';
import {makeDisplayNumberWithDefault, makeDisplayTokenAmount} from '@/common/utils/string-util';
import {useMemo, useState} from 'react';

export const useRealms = () => {
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
        totalCalls: makeDisplayNumberWithDefault(
          realmTransactionInfos[realm.packagePath]?.msgCallCount.toString(),
        ),
        totalGasUsed: {
          value: makeDisplayTokenAmount(realmTransactionInfos[realm.packagePath].gasUsed),
          denom: 'GNOT',
        },
      }));
  }, [data, realmTransactionInfos, currentPage]);

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
