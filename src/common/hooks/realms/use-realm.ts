import {
  useGetRealmFunctionsQuery,
  useGetRealmQuery,
  useGetRealmTransactionsQuery,
} from '@/common/react-query/realm';
import {toBech32AddressByPackagePath} from '@/common/utils/bech32.utility';
import {toNumber, toString} from '@/common/utils/string-util';
import {useMemo, useState} from 'react';
import {GNOTToken, useTokenMeta} from '../common/use-token-meta';
import {useQuery} from 'react-query';
import {useServiceProvider} from '../provider/use-service-provider';

const GNO_ADDRESS_PREFIX = 'g';

export const useRealm = (packagePath: string) => {
  const {blockRepository} = useServiceProvider();
  const {getTokenAmount} = useTokenMeta();
  const {data: realm, isFetched: isFetchedRealm} = useGetRealmQuery(packagePath);
  const {data: realmFunctions, isFetched: isFetchedRealmFunctions} =
    useGetRealmFunctionsQuery(packagePath);
  const {data: realmTransactions, isFetched: isFetchedRealmTransactions} =
    useGetRealmTransactionsQuery(packagePath);
  const [currentPage, setCurrentPage] = useState(0);

  const realmTransactionInfo = useMemo(() => {
    if (!realmTransactions) {
      return null;
    }

    const totalCount = realmTransactions.filter(tx => tx.type === '/vm.m_call').length;
    const totalUsedFeeAmount = realmTransactions
      .map(tx => Number(tx.fee?.value || 0))
      .reduce((accum, current) => accum + current, 0);
    return {
      totalCount,
      totalUsedFees: getTokenAmount(GNOTToken.denom, totalUsedFeeAmount),
    };
  }, [realmTransactions, getTokenAmount]);

  const summary = useMemo(() => {
    if (!realm) {
      return null;
    }

    const addPackageMessage = realm.messages[0].value;
    return {
      name: toString(addPackageMessage.package?.name),
      path: toString(addPackageMessage.package?.path),
      realmAddress: toBech32AddressByPackagePath(
        GNO_ADDRESS_PREFIX,
        addPackageMessage.package?.path || '',
      ),
      publisherAddress: toString(addPackageMessage.creator),
      funcs: realmFunctions?.map(func => func.functionName),
      blockPublished: toNumber(realm.block_height),
      files: realm.messages[0].value.package?.files,
      balance: realm.balance || null,
      contractCalls: realmTransactionInfo?.totalCount || null,
      totalUsedFees: realmTransactionInfo?.totalUsedFees || null,
    };
  }, [realm, realmFunctions, realmTransactionInfo]);

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
        amount: {
          value: tx.amount.value,
          denom: tx.amount.denom,
        },
        fee: {
          value: tx.fee.value,
          denom: 'ugnot',
        },
      }));
  }, [realmTransactions?.length, currentPage]);

  const {data: transactionWithTimes = null, isFetched: isFetchedTransactionWithTimes} = useQuery({
    queryKey: ['realm/transactions', packagePath, `${transactions?.length}`],
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

  const transactionEvents = useMemo(() => {
    if (!realmTransactions) {
      return [];
    }

    return realmTransactions.flatMap(transaction => transaction.events?.map(event => event) || []);
  }, [realmTransactions]);

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    summary,
    realmTransactions: transactionWithTimes || [],
    transactionEvents,
    isFetched:
      isFetchedRealm &&
      isFetchedRealmTransactions &&
      isFetchedTransactionWithTimes &&
      isFetchedRealmFunctions,
    nextPage,
    hasNextPage,
  };
};
