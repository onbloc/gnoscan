import {useMemo, useState} from 'react';
import {
  useGetGRC20Token,
  useGetRealmFunctionsQuery,
  useGetRealmTotalSupplyQuery,
  useGetRealmTransactionsWithArgsQuery,
} from '@/common/react-query/realm';
import {useQuery} from 'react-query';
import {useServiceProvider} from '../provider/use-service-provider';
import {makeDisplayNumber} from '@/common/utils/string-util';

export const useToken = (path: string[] | string | undefined) => {
  const {blockRepository} = useServiceProvider();

  const packagePath = useMemo(() => {
    if (!path) {
      return null;
    }

    if (Array.isArray(path)) {
      return path.join('/');
    }

    return path;
  }, [path]);
  const {data: totalSupply = 0} = useGetRealmTotalSupplyQuery(packagePath);
  const {data, isFetched} = useGetGRC20Token(packagePath);
  const {data: realmFunctions, isFetched: isFetchedRealmFunctions} =
    useGetRealmFunctionsQuery(packagePath);
  const {data: realmTransactions} = useGetRealmTransactionsWithArgsQuery(packagePath);
  const [currentPage, setCurrentPage] = useState(0);

  const holders = useMemo(() => {
    if (!realmTransactions) {
      return 0;
    }

    const transferAddresses = realmTransactions.flatMap(tx =>
      tx.success
        ? tx.messages
            ?.filter(message => message.value?.func === 'Transfer')
            .map(message => message.value?.args?.[0])
        : [],
    );
    return new Set(transferAddresses).size;
  }, [realmTransactions]);

  const tokenInfo = useMemo(() => {
    return data?.tokenInfo;
  }, [data?.tokenInfo]);

  const hasNextPage = useMemo(() => {
    if (!realmTransactions) {
      return false;
    }

    return realmTransactions.length > (currentPage + 1) * 20;
  }, [currentPage, realmTransactions?.length]);

  const transactions = useMemo(() => {
    if (!realmTransactions) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = realmTransactions.length > nextIndex ? nextIndex : realmTransactions.length;
    return realmTransactions
      .filter((_: any, index: number) => index < endIndex)
      .map(tx => ({
        ...tx,
      }));
  }, [realmTransactions?.length, currentPage, tokenInfo]);

  const {data: transactionWithTimes = null, isFetched: isFetchedTransactionWithTimes} = useQuery({
    queryKey: ['token/transactions', `${path}`, `${transactions?.length}`],
    queryFn: () =>
      Promise.all(
        transactions?.map(async transaction => {
          const time = await blockRepository?.getBlockTime(transaction.blockHeight);
          return {
            ...transaction,
            time,
          };
        }) || [],
      ),
    enabled: !!transactions,
    keepPreviousData: true,
  });

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    isFetched: isFetched && isFetchedRealmFunctions,
    isFetchedTransactions: isFetchedTransactionWithTimes,
    summary: {
      name: data?.tokenInfo.name || '',
      symbol: data?.tokenInfo.symbol || '',
      decimals: data?.tokenInfo.decimals || '',
      packagePath: data?.tokenInfo.packagePath || '',
      owner: data?.tokenInfo.owner || '',
      functions: realmFunctions?.map(func => func.functionName) || [],
      totalSupply: makeDisplayNumber(totalSupply || 0),
      holders,
    },
    transactions: transactionWithTimes,
    hasNextPage,
    nextPage,
    files: data?.realmTransaction.messages.flatMap(m => m.value.package?.files || []),
  };
};
