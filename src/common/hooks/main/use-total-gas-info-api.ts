import {useMemo} from 'react';
import {useGetMonthlyTransactionStatInfo} from '../common/use-get-monthly-transaction-stat-info';

export const useTotalGasInfoApi = () => {
  const {data, isFetched} = useGetMonthlyTransactionStatInfo();

  const transactionRealmGasInfo = useMemo(() => {
    if (!data) {
      return null;
    }

    const dateTotalGas: {[key in string]: number} = {};
    const realmTotalGas: {[key in string]: number} = {};
    const gasSharedInfo = data.realmGasSharedInfo;
    const bestRealmPaths = [...data.bestRealms.map(d => d.packagePath), 'rest'];

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
  }, [data]);

  return {
    isFetched,
    transactionRealmGasInfo,
  };
};
