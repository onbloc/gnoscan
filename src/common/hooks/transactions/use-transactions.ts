import {useMemo, useState} from 'react';
import {useGetTransactionsQuery} from '@/common/react-query/transaction';
import {useGetLatestBlock} from '../common/use-get-latest-block';

export const useTransactions = ({enabled = true}) => {
  const {latestBlock} = useGetLatestBlock();
  const {data, isFetched} = useGetTransactionsQuery(
    latestBlock?.block_meta.header.total_txs || null,
    {enabled},
  );
  const [currentPage, setCurrentPage] = useState(0);

  const hasNextPage = useMemo(() => {
    if (!data) {
      return false;
    }

    return data.length > (currentPage + 1) * 20;
  }, [currentPage, data]);

  const transactions = useMemo(() => {
    if (!data) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = data.length > nextIndex ? nextIndex : data.length;
    return data.filter((_, index) => index < endIndex);
  }, [data, currentPage]);

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    transactions,
    isFetched: !!data || isFetched,
    nextPage,
    hasNextPage,
  };
};
