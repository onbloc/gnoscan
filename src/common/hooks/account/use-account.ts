import {useMemo} from 'react';
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

  return {
    isFetched:
      isFetchedNativeTokenBalance &&
      isFetchedGRC20TokenBalance &&
      isFetchedGRC20Tokens &&
      isFetchedTokenMeta,
    accountTransactions,
    isFetchedAccountTransactions: isFetchedTransactions,
    tokenBalances,
    username: undefined,
  };
};
