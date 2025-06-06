import { useGetBlocksQuery, useGetLatestBlockHeightQuery } from "@/common/react-query/block";
import { Block } from "@/types/data-type";
import { useEffect, useMemo, useState } from "react";

export const useBlocks = () => {
  const { data: latestBlockHeight } = useGetLatestBlockHeightQuery();
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetched, isError, isLoading } = useGetBlocksQuery(currentBlockHeight);

  const blocks = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    return data.pages.reduce((accum: Block[], current) => {
      return current ? [...accum, ...current] : accum;
    }, []);
  }, [data?.pages]);

  useEffect(() => {
    if (latestBlockHeight !== undefined && latestBlockHeight !== null) {
      setCurrentBlockHeight(latestBlockHeight);
    }
  }, [latestBlockHeight]);

  return {
    data: blocks,
    isFetched: isFetched && latestBlockHeight !== undefined,
    isLoading,
    isError: latestBlockHeight === null || isError,
    fetchNextPage,
    hasNextPage,
  };
};
