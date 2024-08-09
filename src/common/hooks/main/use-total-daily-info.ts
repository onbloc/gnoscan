import {useMemo} from 'react';
import {useGetBefore30DBlock} from '../common/use-get-before-30d-block';
import {useGetSimpleTransactions} from '../common/use-get-simple-transactions';
import {useGetSimpleTransactionWithTimes} from '../common/use-get-block-times';
import {MonthlyDailyTransaction} from '@/types/data-type';
import {dateToStr} from '@/common/utils/date-util';

export const useTotalDailyInfo = () => {
  const {data: blockHeightOfBefor30d} = useGetBefore30DBlock();
  const {data: simpleTransactions} = useGetSimpleTransactions(blockHeightOfBefor30d);
  const {data, isFetched} = useGetSimpleTransactionWithTimes(simpleTransactions);

  const transactionInfo: {
    date: string;
    totalGasFee: {
      value: number;
      denom: string;
    };
    txCount: number;
  }[] = useMemo(() => {
    if (!data) {
      return [];
    }

    const transactionInfo: {
      [key in string]: MonthlyDailyTransaction;
    } = {};

    data?.forEach(tx => {
      const blockTime = new Date(tx.time || '');
      const dateKey = dateToStr(blockTime);

      const totalGasFee =
        (transactionInfo?.[dateKey]?.totalGasFee || 0) + Number(tx.gas_fee.amount);
      const txCount = (transactionInfo?.[dateKey]?.txCount || 0) + 1;
      transactionInfo[dateKey] = {
        totalGasFee,
        txCount,
      };
    });

    return Object.entries(transactionInfo).map(entry => ({
      date: entry[0],
      totalGasFee: {
        value: entry[1].totalGasFee,
        denom: 'ugnot',
      },
      txCount: entry[1].txCount,
    }));
  }, [data]);

  return {
    isFetched,
    transactionInfo,
  };
};
