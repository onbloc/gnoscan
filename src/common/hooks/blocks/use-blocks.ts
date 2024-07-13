import {useGetBlocksQuery, useGetLatestBlockHeightQuery} from '@/common/react-query/block';
import {Block} from '@/types/data-type';
import {useMemo} from 'react';

export const useBlocks = () => {
  const {data: latestBlockHeight} = useGetLatestBlockHeightQuery();
  const {data, fetchNextPage, hasNextPage, isFetched, isError} =
    useGetBlocksQuery(latestBlockHeight);

  const blocks = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.reduce((accum: Block[], current) => {
      return current ? [...accum, ...current] : accum;
    }, []);
  }, [data?.pages]);

  return {
    data: blocks,
    isFetched: isFetched && latestBlockHeight !== undefined,
    isError: latestBlockHeight === null || isError,
    fetchNextPage,
    hasNextPage,
  };
};
