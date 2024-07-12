import {UseInfiniteQueryOptions, UseQueryOptions, useInfiniteQuery, useQuery} from 'react-query';
import {useServiceProvider} from '@/common/hooks/provider/use-service-provider';
import {QUERY_KEY} from './types';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';
import {
  AddPackageValue,
  GRC20Info,
  RealmFunction,
  RealmTransaction,
  RealmTransactionInfo,
} from '@/repositories/realm-repository.ts';
import {Transaction} from '@/types/data-type';
import {mapTransactionByRealm} from '@/repositories/realm-repository.ts/mapper';
import {mapVMTransaction} from '@/repositories/response/transaction.mapper';

export const useGetRealmsQuery = (options?: UseQueryOptions<any, Error>) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<any, Error>({
    queryKey: [QUERY_KEY.getRealms, currentNetwork?.chainId || ''],
    queryFn: async () => {
      if (!realmRepository) {
        return [null];
      }
      const result = await realmRepository.getRealms();
      if (!result) {
        return [null];
      }

      return (
        result?.data?.transactions?.flatMap((tx: any) =>
          tx.messages.map((message: any) => ({
            hash: tx.hash,
            index: tx.index,
            success: tx.success,
            blockHeight: tx.block_height,
            packageName: message.value.package.name,
            packagePath: message.value.package.path,
            creator: message.value.creator,
            functionCount: 0,
            totalCalls: 0,
            totalGasUsed: {
              value: '0',
              denom: 'GNOT',
            },
          })),
        ) || []
      );
    },
    select: data => data.sort((item1: any, item2: any) => item2.blockHeight - item1.blockHeight),
    enabled: !!realmRepository,
    ...options,
    keepPreviousData: true,
    cacheTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetRealmQuery = (
  packagePath: string,
  options?: UseQueryOptions<RealmTransaction<AddPackageValue> | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<RealmTransaction<AddPackageValue> | null, Error>({
    queryKey: [QUERY_KEY.getRealm, currentNetwork?.chainId || '', packagePath],
    queryFn: async () => {
      if (!realmRepository) {
        return null;
      }

      const result = await realmRepository.getRealm(packagePath);
      if (!result) {
        return null;
      }

      const balance = await realmRepository.getRealmBalance(packagePath);
      return {...result, balance};
    },
    enabled: !!realmRepository,
    ...options,
  });
};

export const useGetRealmFunctionsQuery = (
  packagePath: string | null,
  options?: UseQueryOptions<RealmFunction[] | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<RealmFunction[] | null, Error>({
    queryKey: [QUERY_KEY.getRealmFunctions, currentNetwork?.chainId || '', packagePath],
    queryFn: async () => {
      if (!realmRepository || !packagePath) {
        return null;
      }
      const result = await realmRepository.getRealmFunctions(decodeURIComponent(packagePath));
      return result;
    },
    enabled: !!realmRepository && !!packagePath,
    ...options,
  });
};

export const useGetRealmPackagesInfinity = (
  pageSize = 20,
  options?: UseInfiniteQueryOptions<any | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useInfiniteQuery<any | null, Error>({
    queryKey: [QUERY_KEY.getRealmPackages, currentNetwork?.chainId || ''],
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) {
        return false;
      }
      if (lastPage.length < pageSize) {
        return false;
      }
      return pages.length;
    },
    queryFn: async context => {
      if (!realmRepository) {
        return null;
      }
      const currentPageIndex = context?.pageParam || 0;
      const result = await realmRepository
        .getRealmPackages({
          page: currentPageIndex,
          pageSize,
        })
        .then(result =>
          result?.flatMap(tx =>
            tx.messages.map(message => ({
              hash: tx.hash,
              index: tx.index,
              success: tx.success,
              blockHeight: tx.block_height,
              packageName: message.value.package?.name || '',
              packagePath: message.value.package?.path || '',
              creator: message.value.creator,
              functionCount: 0,
              totalCalls: 0,
              totalGasUsed: {
                value: '0',
                denom: 'GNOT',
              },
            })),
          ),
        );

      return result;
    },
    enabled: !!realmRepository,
    keepPreviousData: true,
    ...options,
  });
};

export const useGetRealmTransactionInfoQuery = (
  packagePath: string,
  options?: UseQueryOptions<RealmTransactionInfo | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<RealmTransactionInfo | null, Error>({
    queryKey: [QUERY_KEY.getRealmTransactionInfo, currentNetwork?.chainId || '', packagePath],
    queryFn: async () => {
      if (!realmRepository) {
        return null;
      }
      const result = await realmRepository.getRealmTransactionInfo(packagePath).catch(() => ({
        msgCallCount: 0,
        gasUsed: 0,
      }));
      return result;
    },
    enabled: !!realmRepository,
    ...options,
  });
};

export const useGetRealmTransactionInfosQuery = (
  options?: UseQueryOptions<{[key in string]: RealmTransactionInfo} | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<{[key in string]: RealmTransactionInfo} | null, Error>({
    queryKey: [QUERY_KEY.getRealmFunctions, currentNetwork?.chainId || ''],
    queryFn: async () => {
      if (!realmRepository) {
        return null;
      }
      const result = await realmRepository.getRealmTransactionInfos();
      return result;
    },
    enabled: !!realmRepository,
    ...options,
  });
};

export const useGetRealmTransactionsQuery = (
  realmPath: string | null,
  options?: UseQueryOptions<Transaction[], Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<Transaction[], Error>({
    queryKey: [QUERY_KEY.getRealmTransactions, currentNetwork?.chainId || '', realmPath],
    queryFn: async () => {
      if (!realmRepository || !realmPath) {
        return [];
      }
      const transactions = await realmRepository.getRealmTransactions(realmPath);
      if (!transactions) {
        return [];
      }

      return transactions.map(mapVMTransaction);
    },
    select: data => data.sort((item1, item2) => item2.blockHeight - item1.blockHeight),
    enabled: !!realmRepository && !!realmPath,
    ...options,
  });
};

export const useGetHoldersQuery = (
  realmPath: string | null,
  options?: UseQueryOptions<number, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.getHoldersQuery, currentNetwork?.chainId || '', realmPath],
    queryFn: async () => {
      if (!realmRepository || !realmPath) {
        return 0;
      }
      const transactions = await realmRepository.getRealmCallTransactionsWithArgs(realmPath);
      if (!transactions) {
        return 0;
      }

      const addresses = transactions
        .flatMap(tx =>
          tx.messages.flatMap(message => {
            const caller = message.value.caller;
            const receiver = message.value?.args?.[0];
            return [caller, receiver];
          }),
        )
        .filter(address => !!address);

      return [...new Set(addresses)].length;
    },
    enabled: !!realmRepository && !!realmPath,
    ...options,
  });
};

export const useGetRealmTotalSupplyQuery = (
  realmPath: string | null,
  options?: UseQueryOptions<number, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.getRealmTotalSupply, currentNetwork?.chainId || '', realmPath],
    queryFn: async () => {
      if (!realmRepository || !realmPath) {
        return 0;
      }
      const totalSupply = await realmRepository.getRealmTotalSupply(realmPath);
      if (!totalSupply) {
        return 0;
      }

      return totalSupply;
    },
    enabled: !!realmRepository && !!realmPath,
    ...options,
  });
};

export const useGetRealmTransactionsWithArgsQuery = (
  realmPath: string | null,
  options?: UseQueryOptions<Transaction[], Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<Transaction[], Error>({
    queryKey: [QUERY_KEY.getRealmTransactionsWithArgs, currentNetwork?.chainId || '', realmPath],
    queryFn: async () => {
      if (!realmRepository || !realmPath) {
        return [];
      }
      const transactions = await realmRepository.getRealmTransactionsWithArgs(realmPath);
      if (!transactions) {
        return [];
      }

      return transactions.map(mapTransactionByRealm);
    },
    select: data => data.sort((item1, item2) => item2.blockHeight - item1.blockHeight),
    enabled: !!realmRepository && !!realmPath,
    ...options,
  });
};

export const useGetGRC20Tokens = (options?: UseQueryOptions<GRC20Info[], Error>) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<GRC20Info[], Error>({
    queryKey: [QUERY_KEY.getGRC20Tokens, currentNetwork?.chainId || ''],
    queryFn: async () => {
      if (!realmRepository) {
        return [];
      }
      const tokens = await realmRepository.getTokens();
      return tokens || [];
    },
    enabled: !!realmRepository,
    ...options,
    keepPreviousData: true,
    cacheTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetGRC20Token = (
  packagePath: string | null,
  options?: UseQueryOptions<
    {
      realmTransaction: RealmTransaction<AddPackageValue>;
      tokenInfo: GRC20Info;
    } | null,
    Error
  >,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<
    {
      realmTransaction: RealmTransaction<AddPackageValue>;
      tokenInfo: GRC20Info;
    } | null,
    Error
  >({
    queryKey: [QUERY_KEY.getGRC20Token, currentNetwork?.chainId || '', packagePath],
    queryFn: async () => {
      if (!realmRepository || !packagePath) {
        return null;
      }

      const result = await realmRepository.getToken(packagePath);
      if (!result) {
        return null;
      }

      return result;
    },
    enabled: !!realmRepository && !!packagePath,
    ...options,
  });
};
