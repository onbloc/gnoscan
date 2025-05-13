/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseInfiniteQueryOptions, UseQueryOptions, useInfiniteQuery, useQuery } from "react-query";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { QUERY_KEY } from "./types";
import { TotalTransactionStatInfo, Transaction } from "@/types/data-type";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { PageInfo } from "@/common/clients/indexer-client/types";

export const useGetTransactionBlockHeightQuery = (
  hash: string,
  options?: UseQueryOptions<{ block: any; blockResult: any } | null, Error>,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { blockRepository, transactionRepository } = useServiceProvider();

  return useQuery<{ block: any; blockResult: any } | null, Error>({
    queryKey: [QUERY_KEY.getTransactionBlockHeight, currentNetwork?.rpcUrl || "", hash],
    queryFn: async () => {
      if (!transactionRepository || !blockRepository) {
        return null;
      }
      const blockHeight = await transactionRepository.getTransactionBlockHeight(hash).catch(() => null);
      if (!blockHeight) {
        return null;
      }

      const block = await blockRepository.getBlock(blockHeight).catch(() => null);
      const blockResult = await blockRepository.getBlockResult(blockHeight).catch(() => null);
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
    retry: 1,
    enabled: !!transactionRepository && !!blockRepository,
    ...options,
  });
};

export const useGetTransactionStatInfoQuery = (
  totalTx: string | null,
  options?: UseQueryOptions<TotalTransactionStatInfo | null, Error>,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { transactionRepository } = useServiceProvider();

  return useQuery<TotalTransactionStatInfo | null, Error>({
    queryKey: [QUERY_KEY.getTransactionStatInfo, currentNetwork?.rpcUrl || "", totalTx],
    queryFn: async () => {
      if (!transactionRepository) {
        return null;
      }

      return transactionRepository.getTransactionStatInfo().catch(() => null);
    },
    ...options,
    retry: 1,
    keepPreviousData: true,
    enabled: !!transactionRepository && options?.enabled,
  });
};
export const useGetTransactionsQuery = (
  totalTx: string | null,
  options?: UseQueryOptions<Transaction[] | null, Error>,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { transactionRepository } = useServiceProvider();

  return useQuery<Transaction[] | null, Error>({
    queryKey: [QUERY_KEY.getTransactions, currentNetwork?.rpcUrl || "", totalTx],
    queryFn: async () => {
      if (!transactionRepository) {
        return null;
      }
      const result = await transactionRepository
        .getTransactions(0, 0)
        .then(txs => txs.sort((a1, a2) => a2.blockHeight - a1.blockHeight));
      return result;
    },
    ...options,
    retry: 1,
    keepPreviousData: true,
    enabled: !!transactionRepository && options?.enabled,
  });
};

export const useGetTransactionsInfinityQuery = (
  totalTx: string | null,
  options?: UseInfiniteQueryOptions<
    {
      pageInfo: PageInfo;
      transactions: Transaction[];
    } | null,
    Error
  >,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { transactionRepository } = useServiceProvider();

  return useInfiniteQuery<
    {
      pageInfo: PageInfo;
      transactions: Transaction[];
    } | null,
    Error
  >({
    queryKey: [QUERY_KEY.getTransactionInfinity, currentNetwork?.chainId || "", totalTx || "0"],
    getNextPageParam: lastPage => {
      if (!lastPage) {
        return null;
      }
      return lastPage.pageInfo.last;
    },
    queryFn: async context => {
      if (!transactionRepository || !totalTx) {
        return null;
      }

      const cursor = context?.pageParam || null;
      return transactionRepository.getTransactionsPage(cursor);
    },
    enabled: !!transactionRepository && options?.enabled,
    keepPreviousData: true,
    ...options,
  });
};

export const useGetUsingAccountTransactionCount = (options?: UseQueryOptions<number, Error>) => {
  const { currentNetwork, isCustomNetwork } = useNetworkProvider();
  const { transactionRepository } = useServiceProvider();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.useGetUsingAccountTransactionCount, currentNetwork?.chainId || ""],
    queryFn: async () => {
      if (!transactionRepository) {
        return 0;
      }

      if (!isCustomNetwork) {
        return transactionRepository.getTransactionStatInfo().then(statInfo => statInfo.accounts);
      }

      const transactions = await transactionRepository.getTransactions(0, 0);
      const allAccounts: string[] = transactions.flatMap(tx => [tx?.from, tx?.to || ""]).filter(account => !!account);

      const accounts = [...new Set(allAccounts)];
      return accounts.length;
    },
    enabled: !!transactionRepository && options?.enabled,
    keepPreviousData: true,
    ...options,
  });
};
