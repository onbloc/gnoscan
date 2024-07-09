import {useMemo} from 'react';
import {useGetBefore30DBlock} from '../common/use-get-before-30d-block';
import {useGetSimpleTransactions} from '../common/use-get-simple-transactions';
import {useGetSimpleTransactionWithTimes} from '../common/use-get-block-times';

export const useTotalDailyInfo = () => {
  const {data: blockHeightOfBefor30d} = useGetBefore30DBlock();
  const {data: simpleTransactions} = useGetSimpleTransactions(blockHeightOfBefor30d);
  const {data, isFetched} = useGetSimpleTransactionWithTimes(simpleTransactions);

  const transactionInfo = useMemo(() => {
    if (!data) {
      return [];
    }

    const transactionInfo: {
      [key in string]: {
        gasUsed: number;
        gasFee: number;
        totalTxs: number;
      };
    } = {};

    data?.forEach(tx => {
      const blockTime = new Date(tx.time || '');
      const dateKey = [blockTime.getFullYear(), blockTime.getMonth() + 1, blockTime.getDate()].join(
        '-',
      );

      const gasUsed = (transactionInfo?.[dateKey]?.gasUsed || 0) + Number(tx.gas_used);
      const gasFee = (transactionInfo?.[dateKey]?.gasFee || 0) + Number(tx.gas_fee.amount);
      const totalTxs = (transactionInfo?.[dateKey]?.totalTxs || 0) + 1;
      transactionInfo[dateKey] = {
        gasUsed,
        gasFee,
        totalTxs,
      };
    });

    return Object.entries(transactionInfo).map(entry => ({
      date: entry[0],
      gasFee: {
        value: entry[1].gasFee,
        denom: 'ugnot',
      },
      totalTxs: entry[1].totalTxs,
    }));
  }, [data]);

  return {
    isFetched,
    transactionInfo,
  };
};
