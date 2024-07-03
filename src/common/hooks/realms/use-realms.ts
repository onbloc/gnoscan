import {useGetRealmsQuery} from '@/common/react-query/realm';
import {useMemo, useState} from 'react';

export const useRealms = () => {
  const {data, isFetched} = useGetRealmsQuery();
  const [currentPage, setCurrentPage] = useState(0);

  const hasNextPage = useMemo(() => {
    if (!data) {
      return false;
    }

    return data.length > (currentPage + 1) * 20;
  }, [currentPage, data?.length]);

  const realms = useMemo(() => {
    if (!data) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = data.length > nextIndex ? nextIndex : data.length;
    return data.filter((_: any, index: number) => index < endIndex);
  }, [data?.length, currentPage]);

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    realms,
    isFetched,
    nextPage,
    hasNextPage,
  };
};
