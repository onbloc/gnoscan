import {useMemo} from 'react';
import {useGetLatestBlock} from '../common/use-get-latest-block';
import {makeDisplayNumber} from '@/common/utils/string-util';

export const useTransactionSummaryInfo = () => {
  const {isFetched: isFetchedLatestBlock, latestBlock} = useGetLatestBlock();

  const isFetched = useMemo(() => {
    return isFetchedLatestBlock || !!latestBlock;
  }, [isFetchedLatestBlock, latestBlock]);

  const totalTransactions = useMemo(() => {
    if (!latestBlock) {
      return '0';
    }

    return makeDisplayNumber(latestBlock.block.header.total_txs);
  }, [latestBlock]);

  const transactionFeeAverage = useMemo(() => {
    return '0';
  }, []);

  const transactionTotalFee = useMemo(() => {
    return '0';
  }, []);

  return {
    isFetched,
    transactionSummaryInfo: {
      totalTransactions,
      transactionFeeAverage,
      transactionTotalFee,
    },
  };
};
