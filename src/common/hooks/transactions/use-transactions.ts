import {useGetTransactionsQuery} from '@/common/react-query/transaction';
import {useMemo, useState} from 'react';

export const useTransactions = () => {
  const {data, isFetched} = useGetTransactionsQuery();
  const [currentPage, setCurrentPage] = useState(0);

  const hasNextPage = useMemo(() => {
    if (!data) {
      return false;
    }

    return data.length > (currentPage + 1) * 20;
  }, [currentPage, data?.length]);

  const transactions = useMemo(() => {
    if (!data) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = data.length > nextIndex ? nextIndex : data.length;
    return data.filter((_, index) => index < endIndex);
  }, [data?.length, currentPage]);

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    transactions,
    isFetched,
    nextPage,
    hasNextPage,
  };
};
