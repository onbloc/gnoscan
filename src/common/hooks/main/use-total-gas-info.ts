import {useMemo} from 'react';
import {useGetBefore30DBlock} from '../common/use-get-before-30d-block';
import {useGetSimpleTransactions} from '../common/use-get-simple-transactions';
import {useGetSimpleTransactionWithTimes} from '../common/use-get-block-times';

export const useTotalGasInfo = () => {
  const {data: blockHeightOfBefore30d} = useGetBefore30DBlock();
  const {data: simpleTransactions} = useGetSimpleTransactions(blockHeightOfBefore30d);
  const {data, isFetched} = useGetSimpleTransactionWithTimes(simpleTransactions);

  const transactionRealmGasInfo = useMemo(() => {
    if (!data) {
      return null;
    }

    const transactionInfo: {[key in string]: {[key in string]: number}} = {};
    const dateTotalGas: {[key in string]: number} = {};
    const realmTotalGas: {[key in string]: number} = {};

    data?.forEach(tx => {
      const blockTime = new Date(tx.time || '');
      const pkgPath = tx.messages?.[0].value.pkg_path;
      if (!pkgPath) {
        return;
      }
      const date = [
        blockTime.getUTCFullYear(),
        blockTime.getUTCMonth() + 1,
        blockTime.getUTCDate(),
      ].join('-');

      if (!transactionInfo[date]) {
        transactionInfo[date] = {};
      }

      if (!transactionInfo[date][pkgPath]) {
        transactionInfo[date][pkgPath] = 0;
      }

      transactionInfo[date][pkgPath] += tx.gas_fee.amount;
      realmTotalGas[pkgPath] = (realmTotalGas[pkgPath] || 0) + tx.gas_fee.amount;
      dateTotalGas[date] = (dateTotalGas[date] || 0) + tx.gas_fee.amount;
    });

    const displayRealms = Object.entries(realmTotalGas)
      .map(entry => ({
        pkgPath: entry[0],
        totalTxs: entry[1],
      }))
      .sort((t1, t2) => t2.totalTxs - t1.totalTxs)
      .filter((_, index) => index < 5)
      .map(t => t.pkgPath);

    return {
      displayRealms,
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
