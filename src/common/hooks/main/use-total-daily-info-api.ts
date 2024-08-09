import {useMemo} from 'react';
import {useGetMonthlyTransactionStatInfo} from '../common/use-get-monthly-transaction-stat-info';

export const useTotalDailyInfoApi = () => {
  const {data: statInfo, isFetched} = useGetMonthlyTransactionStatInfo();

  const transactionInfo: {
    date: string;
    totalGasFee: {
      value: number;
      denom: string;
    };
    txCount: number;
  }[] = useMemo(() => {
    if (!statInfo) {
      return [];
    }

    return Object.entries(statInfo.dailyTransactionInfo).map(entry => ({
      date: entry[0],
      totalGasFee: {
        value: entry[1].totalGasFee,
        denom: 'ugnot',
      },
      txCount: entry[1].txCount,
    }));
  }, [statInfo]);

  return {
    isFetched,
    transactionInfo,
  };
};
