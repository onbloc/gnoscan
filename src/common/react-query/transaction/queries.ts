import {UseQueryOptions, useQuery} from 'react-query';
import {useServiceProvider} from '@/common/hooks/provider/use-service-provider';
import {QUERY_KEY} from './types';
import {Transaction} from '@/types/data-type';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';

export const useGetTransactionBlockHeightQuery = (
  hash: string,
  options?: UseQueryOptions<{block: any; blockResult: any} | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {blockRepository, transactionRepository} = useServiceProvider();

  return useQuery<{block: any; blockResult: any} | null, Error>({
    queryKey: [QUERY_KEY.getTransactionBlockHeight, currentNetwork?.chainId || '', hash],
    queryFn: async () => {
      if (!transactionRepository || !blockRepository) {
        return null;
      }
      const blockHeight = await transactionRepository.getTransactionBlockHeight(hash);
      if (!blockHeight) {
        return null;
      }

      const block = await blockRepository.getBlock(blockHeight);
      const blockResult = await blockRepository.getBlockResult(blockHeight);
      return {
        block,
        blockResult,
      };
    },
    select: data =>
      data || {
        block: null,
        blockResult: null,
      },
    enabled: !!transactionRepository && !!blockRepository,
    ...options,
  });
};

export const useGetTransactionsQuery = (
  totalTx: string | null,
  options?: UseQueryOptions<Transaction[] | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {transactionRepository} = useServiceProvider();

  return useQuery<Transaction[] | null, Error>({
    queryKey: [QUERY_KEY.getTransactions, currentNetwork?.chainId || '', totalTx],
    queryFn: () => {
      if (!transactionRepository) {
        return null;
      }
      return transactionRepository
        .getTransactions(0, 0)
        .then(txs => txs.sort((a1, a2) => a2.blockHeight - a1.blockHeight));
    },
    enabled: !!transactionRepository && options?.enabled,
    keepPreviousData: true,
    ...options,
  });
};

export const useGetUsingAccountTransactionCount = (
  options?: UseQueryOptions<
    {
      accounts: string[];
      length: number;
    },
    Error
  >,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {transactionRepository} = useServiceProvider();

  return useQuery<
    {
      accounts: string[];
      length: number;
    },
    Error
  >({
    queryKey: [QUERY_KEY.useGetUsingAccountTransactionCount, currentNetwork?.chainId || ''],
    queryFn: async () => {
      if (!transactionRepository) {
        return {
          accounts: [],
          length: 0,
        };
      }
      const transactions = await transactionRepository.getTransactions(0, 0);
      const allAccounts: string[] = transactions
        .flatMap(tx => [tx?.from, tx?.to || ''])
        .filter(account => !!account);

      const accounts = [...new Set(allAccounts)];
      const length = accounts.length;
      return {
        accounts,
        length,
      };
    },
    enabled: !!transactionRepository && options?.enabled,
    keepPreviousData: true,
    ...options,
  });
};
