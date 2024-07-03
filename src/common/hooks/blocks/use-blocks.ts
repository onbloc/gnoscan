import {useGetBlocksQuery, useGetLatestBlockHeightQuery} from '@/common/react-query/block';

export const useBlocks = () => {
  const {data: latestBlockHeight = null} = useGetLatestBlockHeightQuery();
  const {data, isFetched, fetchNextPage, hasNextPage} = useGetBlocksQuery(latestBlockHeight);

  return {
    data,
    isFetched: isFetched && !!latestBlockHeight,
    fetchNextPage,
    hasNextPage,
  };
};
