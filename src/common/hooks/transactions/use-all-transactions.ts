import {useMemo, useState} from 'react';
import {useGetTransactionsQuery} from '@/common/react-query/transaction';
import {useGetLatestBlock} from '../common/use-get-latest-block';
import {useServiceProvider} from '../provider/use-service-provider';
import {useQuery} from 'react-query';
import {Transaction} from '@/types/data-type';

export const useAllTransactions = ({enabled = true}) => {
  const {blockRepository} = useServiceProvider();
  const {latestBlock} = useGetLatestBlock();
  const {data, isError: isErrorTransactions} = useGetTransactionsQuery(
    latestBlock?.block_meta.header.total_txs || null,
    {
      enabled,
    },
  );
  const [currentPage, setCurrentPage] = useState(0);

  const hasNextPage = useMemo(() => {
    if (!data) {
      return false;
    }

    return data.length > (currentPage + 1) * 20;
  }, [currentPage, data]);

  const transactions: Transaction[] = useMemo(() => {
    if (!data) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = data.length > nextIndex ? nextIndex : data.length;
    return data.filter((_, index) => index < endIndex);
  }, [data, currentPage]);

  const {
    data: transactionWithTimes = null,
    isFetched: isFetchedTransactionWithTimes,
    isError: isErrorTransactionWithTimes,
  } = useQuery({
    queryKey: ['transactionsWithTimes/all-transactions', `${transactions.length}`],
    queryFn: () =>
      Promise.all(
        transactions.map(async transaction => {
          const time = await blockRepository?.getBlockTime(transaction.blockHeight);
          return {
            ...transaction,
            time,
          };
        }),
      ).catch(() => []),
    keepPreviousData: true,
  });

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    transactions: transactionWithTimes as Transaction[],
    isFetched: isFetchedTransactionWithTimes || !!transactionWithTimes?.length,
    isError: isErrorTransactionWithTimes || isErrorTransactions,
    nextPage,
    hasNextPage,
  };
};
