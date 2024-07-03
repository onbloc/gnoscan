import {useMemo} from 'react';
import BigNumber from 'bignumber.js';

import {makeDisplayNumber} from '@/common/utils/string-util';
import {useGetFirstBlock} from '../common/use-get-first-block';
import {useGetLatestBlock} from '../common/use-get-latest-block';

export const useBlockSummaryInfo = () => {
  const {firstBlock, isFetched: isFetchedFirstBlock} = useGetFirstBlock();
  const {latestBlock, isFetched: isFetchedLatestBlock} = useGetLatestBlock();

  const isFetched = useMemo(() => {
    return isFetchedFirstBlock && isFetchedLatestBlock;
  }, [isFetchedFirstBlock, isFetchedLatestBlock]);

  const blockHeight = useMemo(() => {
    if (!latestBlock) {
      return '0';
    }

    return makeDisplayNumber(latestBlock.block.header.height);
  }, [latestBlock]);

  const blockTimeAverage = useMemo(() => {
    if (!firstBlock || !latestBlock) {
      return '0';
    }

    const timeDiff =
      new Date(latestBlock.block.header.time).getTime() -
      new Date(firstBlock.block.header.time).getTime();
    const heightDiff =
      Number(latestBlock.block.header.height) - Number(firstBlock.block.header.height);
    return BigNumber(timeDiff).dividedBy(1_000).dividedBy(heightDiff).toFormat(2);
  }, [firstBlock, latestBlock]);

  const txPerBlockAverage = useMemo(() => {
    if (!latestBlock) {
      return '0';
    }

    return BigNumber(latestBlock.block.header.total_txs)
      .dividedBy(latestBlock.block.header.height)
      .toFormat(2);
  }, [firstBlock, latestBlock]);

  const summaryInfo = useMemo(
    () => ({
      blockHeight,
      blockTimeAverage,
      txPerBlockAverage,
    }),
    [blockHeight, blockTimeAverage, txPerBlockAverage],
  );

  return {
    isFetched,
    summaryInfo,
  };
};
