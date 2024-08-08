import {useMemo} from 'react';
import {useGetMonthlyTransactionStatInfo} from '../common/use-get-monthly-transaction-stat-info';

export const useTotalGasInfoApi = (period?: number) => {
  const {data, isFetched} = useGetMonthlyTransactionStatInfo();

  const realmGasSharedInfo = useMemo(() => {
    if (!data) {
      return null;
    }
    if (!period || period === 7) {
      return data.realmGasSharedInfoOfWeek;
    }

    return data.realmGasSharedInfoOfMonth;
  }, [period, data]);

  const bestRealms = useMemo(() => {
    if (!data) {
      return null;
    }
    if (!period || period === 7) {
      return data.bestRealmsOfWeek;
    }

    return data.bestRealmsOfMonth;
  }, [period, data]);

  const transactionRealmGasInfo = useMemo(() => {
    if (!realmGasSharedInfo || !bestRealms) {
      return null;
    }

    const dateTotalGas: {[key in string]: number} = {};
    const realmTotalGas: {[key in string]: number} = {};
    const gasSharedInfo = realmGasSharedInfo;
    const bestRealmPaths = [...bestRealms.map(d => d.packagePath), 'rest'];

    const transactionInfo = Object.keys(gasSharedInfo).reduce<{
      [key in string]: {[key in string]: number};
    }>((accum, currentDate) => {
      const currentInfo: {[key in string]: number} = {};
      for (const realmPath of bestRealmPaths) {
        const gasShared = gasSharedInfo[currentDate]?.[realmPath]?.gasShared || 0;
        currentInfo[realmPath] = gasShared;
        realmTotalGas[realmPath] = (realmTotalGas[realmPath] || 0) + gasShared;
        dateTotalGas[currentDate] = (dateTotalGas[currentDate] || 0) + gasShared;
      }
      accum[currentDate] = currentInfo;
      return accum;
    }, {});

    return {
      displayRealms: bestRealmPaths,
      dateTotalGas,
      results: Object.entries(transactionInfo).map(entry => ({
        date: entry[0],
        packages: Object.entries(entry[1]).map(subEntry => ({
          path: subEntry[0],
          gasFee: subEntry[1],
        })),
      })),
    };
  }, [bestRealms, realmGasSharedInfo]);

  return {
    isFetched,
    transactionRealmGasInfo,
  };
};
