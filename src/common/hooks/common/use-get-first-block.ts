import {useGetBlockQuery, useGetLatestBlockHeightQuery} from '@/common/react-query/block';

export const useGetFirstBlock = () => {
  const {data: firstBlock, isFetched} = useGetBlockQuery(1, {
    keepPreviousData: true,
  });

  return {
    isFetched,
    firstBlock,
  };
};
