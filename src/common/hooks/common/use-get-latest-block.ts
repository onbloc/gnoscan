import { useGetBlockQuery, useGetLatestBlockHeightQuery } from "@/common/react-query/block";

export const useGetLatestBlock = () => {
  const { data: latestBlockHeight, isFetched: isFetchedLatestBlockHeight } = useGetLatestBlockHeightQuery();

  const { data: latestBlock, isFetched: isFetchedLatestBlock } = useGetBlockQuery(latestBlockHeight || null, {
    keepPreviousData: true,
  });

  return {
    isFetched: isFetchedLatestBlockHeight && isFetchedLatestBlock,
    latestBlock: latestBlock || null,
  };
};
