import {UseQueryOptions, useQuery} from 'react-query';
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
      const result = await realmRepository.getRealmFunctions(packagePath);
      return result;
    },
    enabled: !!realmRepository && !!packagePath,
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
