import {UseQueryOptions, useQuery} from 'react-query';
import {useServiceProvider} from '@/common/hooks/provider/use-service-provider';
import {QUERY_KEY} from './types';
import {Amount, Transaction} from '@/types/data-type';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {GNOTToken} from '@/common/hooks/common/use-token-meta';

export const useGetNativeTokenBalance = (
  address: string,
  options?: UseQueryOptions<Amount, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {accountRepository} = useServiceProvider();

  return useQuery<Amount, Error>({
    queryKey: [QUERY_KEY.getNativeBalances, currentNetwork?.chainId || '', address],
    queryFn: () => {
      if (!accountRepository) {
        return {
          value: '0',
          denom: GNOTToken.denom,
        };
      }

      return accountRepository
        .getNativeTokensBalances(address)
        .then(result => {
          const nativeValue = result.split(',');
          const amountValue = parseTokenAmount(nativeValue?.[0] || '').toString();
          return {
            value: amountValue,
            denom: GNOTToken.denom,
          };
        })
        .catch(() => ({
          value: '0',
          denom: GNOTToken.denom,
        }));
    },
    enabled: !!accountRepository,
    ...options,
  });
};

export const useGetGRC20TokenBalances = (
  address: string,
  options?: UseQueryOptions<Amount[], Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {accountRepository} = useServiceProvider();

  return useQuery<Amount[], Error>({
    queryKey: [QUERY_KEY.getGRC20Balances, currentNetwork?.chainId || '', address],
    queryFn: async () => {
      if (!accountRepository) {
        return [];
      }

      const results = await accountRepository
        .getGRC20ReceivedTransactionsByAddress(address)
        .then(txs => txs?.map(tx => tx.packagePath) || []);
      const assets = [...new Set(results)];
      return accountRepository.getGRC20TokensBalances(address, assets);
    },
    enabled: !!accountRepository,
    ...options,
  });
};

export const useGetAccountTransactions = (
  address: string,
  options?: UseQueryOptions<Transaction[], Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {accountRepository} = useServiceProvider();

  return useQuery<Transaction[], Error>({
    queryKey: [QUERY_KEY.getAccountTransactions, currentNetwork?.chainId || '', address],
    queryFn: async () => {
      if (!accountRepository) {
        return [];
      }

      const transactions = await Promise.all([
        accountRepository.getGRC20ReceivedTransactionsByAddress(address),
        accountRepository.getNativeTokenReceivedTransactionsByAddress(address),
        accountRepository.getNativeTokenSendTransactionsByAddress(address),
        accountRepository.getVMTransactionsByAddress(address),
      ])
        .then(results =>
          results
            .filter(result => result != null)
            .flatMap(transactions => transactions as Transaction[]),
        )
        .catch(() => null);

      if (!transactions) {
        return [];
      }

      const transactionMap = transactions.reduce<{[key in number]: Transaction}>(
        (accum, current) => {
          if (!accum?.[current.blockHeight]) {
            accum[current.blockHeight] = current;
          }
          return accum;
        },
        {},
      );

      return Object.values(transactionMap);
    },
    enabled: !!accountRepository && !!address,
    ...options,
  });
};
