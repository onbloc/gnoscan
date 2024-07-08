import {useMemo, useState} from 'react';
import {GNOTToken, useTokenMeta} from '../common/use-token-meta';
import {
  useGetAccountTransactions,
  useGetGRC20TokenBalances,
  useGetNativeTokenBalance,
} from '@/common/react-query/account';

export const useAccount = (address: string) => {
  const {isFetchedGRC20Tokens, isFetchedTokenMeta} = useTokenMeta();
  const {data: nativeBalance, isFetched: isFetchedNativeTokenBalance} =
    useGetNativeTokenBalance(address);
  const {data: grc20Balances, isFetched: isFetchedGRC20TokenBalance} =
    useGetGRC20TokenBalances(address);
  const {data: transactions, isFetched: isFetchedTransactions} = useGetAccountTransactions(address);
  const [currentPage, setCurrentPage] = useState(0);

  const tokenBalances = useMemo(() => {
    if (!nativeBalance) {
      return [
        {
          value: '0',
          denom: GNOTToken.denom,
        },
      ];
    }

    if (!grc20Balances) {
      return [nativeBalance];
    }

    return [nativeBalance, ...grc20Balances];
  }, [nativeBalance, grc20Balances]);

  const accountTransactions = useMemo(() => {
    if (!transactions) {
      return [];
    }
    return transactions.sort((t1, t2) => t2.blockHeight - t1.blockHeight);
  }, [transactions]);

  const accountDisplayTransactions = useMemo(() => {
    if (!accountTransactions) {
      return [];
    }
    const nextIndex = (currentPage + 1) * 20;
    const endIndex =
      accountTransactions.length > nextIndex ? nextIndex : accountTransactions.length;
    return accountTransactions.filter((_: unknown, index: number) => index < endIndex);
  }, [accountTransactions, currentPage]);

  const transactionEvents = useMemo(() => {
    if (!accountTransactions) {
      return [];
    }
    return accountTransactions.flatMap(transaction => transaction.events || []);
  }, [accountTransactions]);

  const hasNextPage = useMemo(() => {
    if (!accountTransactions) {
      return false;
    }

    return accountTransactions.length > (currentPage + 1) * 20;
  }, [currentPage, accountTransactions?.length]);

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    isFetched:
      isFetchedNativeTokenBalance &&
      isFetchedGRC20TokenBalance &&
      isFetchedGRC20Tokens &&
      isFetchedTokenMeta,
    accountTransactions: accountDisplayTransactions,
    transactionEvents,
    isFetchedAccountTransactions: isFetchedTransactions,
    tokenBalances,
    username: undefined,
    hasNextPage,
    nextPage,
  };
};
