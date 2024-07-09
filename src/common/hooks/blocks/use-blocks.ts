import {useGetBlocksQuery, useGetLatestBlockHeightQuery} from '@/common/react-query/block';
import {Block} from '@/types/data-type';
import {useMemo} from 'react';

export const useBlocks = () => {
  const {data: latestBlockHeight = null} = useGetLatestBlockHeightQuery();
  const {data, fetchNextPage, hasNextPage} = useGetBlocksQuery(latestBlockHeight);

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
    isFetched: !!latestBlockHeight && blocks.length > 0,
    fetchNextPage,
    hasNextPage,
  };
};
