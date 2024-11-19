import {
  useGetTransactionsQuery,
  useGetTransactionStatInfoQuery,
} from '@/common/react-query/transaction';
import {makeDisplayNumber} from '@/common/utils/string-util';
import BigNumber from 'bignumber.js';
import {useMemo} from 'react';
import {useGetBeforeBlockByDate} from '../common/use-get-before-1d-block';
import {useGetFirstBlock} from '../common/use-get-first-block';
import {useGetLatestBlock} from '../common/use-get-latest-block';
import {useGetSimpleTransactions} from '../common/use-get-simple-transactions';
import {GNOTToken} from '../common/use-token-meta';
import {useNetworkProvider} from '../provider/use-network-provider';

export const useTransactionSummaryInfo = () => {
  const {isCustomNetwork} = useNetworkProvider();
  const {firstBlock} = useGetFirstBlock();
  const {isFetched: isFetchedLatestBlock, latestBlock} = useGetLatestBlock();
  const {isFetched: isFetchedTransactions, data: allTransactions} = useGetTransactionsQuery(
    latestBlock?.block_meta.header.total_txs || '',
    {
      enabled: isCustomNetwork,
    },
  );
  const {isFetched: isFetchedTransactionStatInfo, data: transactionStatInfo} =
    useGetTransactionStatInfoQuery(latestBlock?.block_meta.header.total_txs || '', {
      enabled: !isCustomNetwork,
    });
  const {data: blockHeightOfBefore1d} = useGetBeforeBlockByDate(1);
  const {data: simpleTransactions} = useGetSimpleTransactions(blockHeightOfBefore1d);

  const isFetched = useMemo(() => {
    if (isCustomNetwork) {
      if (!isFetchedTransactions) {
        return false;
      }
    } else {
      if (!isFetchedTransactionStatInfo) {
        return false;
      }
    }
    return isFetchedLatestBlock || !!latestBlock;
  }, [
    isCustomNetwork,
    isFetchedLatestBlock,
    isFetchedTransactionStatInfo,
    isFetchedTransactions,
    latestBlock,
  ]);

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

    if (isCustomNetwork) {
      const feeAmount =
        allTransactions?.reduce((acc, current) => {
          const txFeeBn = BigNumber(current.fee?.value || 0);
          if (txFeeBn.isNaN()) {
            return acc;
          }
          return txFeeBn.plus(acc).toNumber();
        }, 0) || 0;

      return feeAmount;
    }

    return transactionStatInfo?.gasFee || 0;
  }, [allTransactions, firstBlock, isCustomNetwork, latestBlock, transactionStatInfo?.gasFee]);

  const transactionTotalFee = useMemo(() => {
    return BigNumber(transactionTotalFeeAmount)
      .shiftedBy(GNOTToken.decimals * -1)
      .toFormat(6);
  }, [transactionTotalFeeAmount]);

  const transactionFeeAverage = useMemo(() => {
    if (!simpleTransactions || simpleTransactions.length === 0) {
      return '0';
    }

    const feeAmount =
      simpleTransactions?.reduce((acc, current) => {
        const txFeeBn = BigNumber(current.gas_fee?.amount || 0);
        if (txFeeBn.isNaN()) {
          return acc;
        }
        return txFeeBn.plus(acc).toNumber();
      }, 0) || 0;

    return BigNumber(feeAmount)
      .dividedBy(simpleTransactions?.length)
      .shiftedBy(GNOTToken.decimals * -1)
      .toNumber()
      .toLocaleString();
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
