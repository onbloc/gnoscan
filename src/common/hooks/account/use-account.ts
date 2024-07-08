import {useMemo} from 'react';
import {GNOTToken, useTokenMeta} from '../common/use-token-meta';
import {useGetGRC20TokenBalances, useGetNativeTokenBalance} from '@/common/react-query/account';

export const useAccount = (address: string) => {
  const {isFetchedGRC20Tokens, isFetchedTokenMeta} = useTokenMeta();
  const {data: nativeBalance, isFetched: isFetchedNativeTokenBalance} =
    useGetNativeTokenBalance(address);
  const {data: grc20Balances, isFetched: isFetchedGRC20TokenBalance} =
    useGetGRC20TokenBalances(address);

  const tokenBalances = useMemo(() => {
    if (!nativeBalance) {
      return [
        {
          value: '0',
          denom: GNOTToken.denom,
        },
      ];
    }
    return [nativeBalance, ...(grc20Balances || [])];
  }, [nativeBalance, grc20Balances]);

  return {
    isFetched:
      isFetchedNativeTokenBalance &&
      isFetchedGRC20TokenBalance &&
      isFetchedGRC20Tokens &&
      isFetchedTokenMeta,
    tokenBalances,
    username: undefined,
  };
};
