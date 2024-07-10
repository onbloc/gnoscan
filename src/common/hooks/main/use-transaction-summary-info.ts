import {useMemo} from 'react';
import {useGetLatestBlock} from '../common/use-get-latest-block';
import {makeDisplayNumber} from '@/common/utils/string-util';
import {useGetTransactionsQuery} from '@/common/react-query/transaction';
import {useGetFirstBlock} from '../common/use-get-first-block';
import BigNumber from 'bignumber.js';
import {GNOTToken} from '../common/use-token-meta';
import {useGetSimpleTransactions} from '../common/use-get-simple-transactions';
import {useGetBeforeBlockByDate} from '../common/use-get-before-1d-block';

export const useTransactionSummaryInfo = () => {
  const {firstBlock} = useGetFirstBlock();
  const {isFetched: isFetchedLatestBlock, latestBlock} = useGetLatestBlock();
  const {isFetched: isFetchedTransactions, data: allTransactions} = useGetTransactionsQuery(
    latestBlock?.block_meta.header.total_txs || '',
  );
  const {data: blockHeightOfBefore1d} = useGetBeforeBlockByDate(1);
  const {data: simpleTransactions} = useGetSimpleTransactions(blockHeightOfBefore1d);

  const isFetched = useMemo(() => {
    if (!isFetchedTransactions) {
      return false;
    }
    return isFetchedLatestBlock || !!latestBlock;
  }, [isFetchedLatestBlock, isFetchedTransactions, latestBlock]);

  const totalTransactions = useMemo(() => {
    if (!latestBlock) {
      return '0';
    }

    return makeDisplayNumber(latestBlock.block.header.total_txs);
  }, [latestBlock]);

  const transactionTotalFeeAmount = useMemo(() => {
    if (!firstBlock || !latestBlock) {
      return 0;
    }

    const feeAmount =
      allTransactions?.reduce((acc, current) => {
        const txFeeBn = BigNumber(current.fee.value);
        if (txFeeBn.isNaN()) {
          return acc;
        }
        return txFeeBn.plus(acc).toNumber();
      }, 0) || 0;

    return feeAmount;
  }, [allTransactions, firstBlock, latestBlock]);

  const transactionTotalFee = useMemo(() => {
    return BigNumber(transactionTotalFeeAmount)
      .shiftedBy(GNOTToken.decimals * -1)
      .toFixed(6);
  }, [transactionTotalFeeAmount]);

  const transactionFeeAverage = useMemo(() => {
    if (!simpleTransactions || simpleTransactions.length === 0) {
      return '0';
    }
    const feeAmount =
      simpleTransactions?.reduce((acc, current) => {
        const txFeeBn = BigNumber(current.gas_fee.amount);
        if (txFeeBn.isNaN()) {
          return acc;
        }
        return txFeeBn.plus(acc).toNumber();
      }, 0) || 0;

    return BigNumber(feeAmount)
      .dividedBy(simpleTransactions?.length)
      .shiftedBy(GNOTToken.decimals * -1)
      .toFixed(6);
  }, [simpleTransactions]);

  return {
    isFetched,
    transactionSummaryInfo: {
      totalTransactions,
      transactionFeeAverage,
      transactionTotalFee,
    },
  };
};
