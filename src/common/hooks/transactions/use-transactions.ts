import {useMemo} from 'react';
import {useGetTransactionsInfinityQuery} from '@/common/react-query/transaction';
import {useGetLatestBlock} from '../common/use-get-latest-block';
import {useMakeTransactionsWithTime} from '../common/use-make-transactions-with-time';

const PAGE_LIMIT = 20;

export const useTransactions = ({enabled = true}) => {
  const {latestBlock} = useGetLatestBlock();
  const {
    data = null,
    hasNextPage,
    fetchNextPage,
    isFetched: isFetchedTransactions,
  } = useGetTransactionsInfinityQuery(
    latestBlock?.block_meta.header.total_txs || null,
    {page: 0, pageSize: PAGE_LIMIT},
    {enabled},
  );

  const transactions = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.pages
      .flatMap(page => page || [])
      .sort((t1, t2) => t2.blockHeight - t1.blockHeight)
      .filter((_, index) => index < data.pages.length * PAGE_LIMIT);
  }, [data]);

  const {data: transactionWithTimes = null, isError} = useMakeTransactionsWithTime(
    `transactions/${transactions?.length || 0}`,
    transactions,
  );

  const isFetched = useMemo(() => {
    if (!isFetchedTransactions || !data || !transactionWithTimes) {
      return false;
    }

    if (transactionWithTimes.length > 0) {
      return true;
    }

    return false;
  }, [data, isFetchedTransactions, transactionWithTimes]);

  return {
    transactions: transactionWithTimes || [],
    isFetched: isFetched,
    isError,
    nextPage: () => {
      fetchNextPage();
    },
    hasNextPage: !!hasNextPage,
  };
};
