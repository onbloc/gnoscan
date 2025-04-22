/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageInfo } from "@/common/clients/indexer-client/types";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import {
  AddPackageValue,
  GRC20Info,
  RealmFunction,
  RealmTransaction,
  RealmTransactionInfo,
} from "@/repositories/realm-repository.ts";
import { mapTransactionByRealm } from "@/repositories/realm-repository.ts/mapper";
import { mapVMTransaction } from "@/repositories/response/transaction.mapper";
import { Transaction } from "@/types/data-type";
import { UseInfiniteQueryOptions, UseQueryOptions, useInfiniteQuery, useQuery } from "react-query";
import { QUERY_KEY } from "./types";

export const useGetRealmsQuery = (options?: UseQueryOptions<any, Error>) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<any, Error>({
    queryKey: [QUERY_KEY.getRealms, currentNetwork?.chainId || ""],
    queryFn: async () => {
      if (!realmRepository) {
        return [];
      }
      const result = await realmRepository.getRealms();
      if (!result) {
        return [];
      }

      return result.flatMap((transaction: any) => {
        const tx = transaction;
        return tx.messages.map((message: any) => ({
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
            value: "0",
            denom: "GNOT",
          },
        }));
      });
    },
    select: data => data.sort((item1: any, item2: any) => item2.blockHeight - item1.blockHeight),
    enabled: !!realmRepository,
    ...options,
    keepPreviousData: true,
    cacheTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetLatestRealmsQuery = (options?: UseQueryOptions<any, Error>) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<any, Error>({
    queryKey: [QUERY_KEY.getLatestRealms, currentNetwork?.chainId || ""],
    queryFn: async () => {
      if (!realmRepository) {
        return [];
      }
      const result = await realmRepository.getLatestRealms();
      if (!result) {
        return [];
      }

      return (
        result?.flatMap((transaction: any) => {
          const tx = transaction;
          return tx.messages.map((message: any) => ({
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
              value: "0",
              denom: "GNOT",
            },
          }));
        }) || []
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
  packagePath: string | null,
  options?: UseQueryOptions<RealmTransaction<AddPackageValue> | null, Error>,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<RealmTransaction<AddPackageValue> | null, Error>({
    queryKey: [QUERY_KEY.getRealm, currentNetwork?.chainId || "", packagePath],
    queryFn: async () => {
      if (!realmRepository || !packagePath) {
        return null;
      }

      const result = await realmRepository.getRealm(packagePath);
      if (!result) {
        return null;
      }

      const balance = await realmRepository.getRealmBalance(packagePath);
      return { ...result, balance } as RealmTransaction<AddPackageValue>;
    },
    enabled: !!realmRepository,
    ...options,
  });
};

export const useGetRealmFunctionsQuery = (
  packagePath: string | null,
  options?: UseQueryOptions<RealmFunction[] | null, Error>,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<RealmFunction[] | null, Error>({
    queryKey: [QUERY_KEY.getRealmFunctions, currentNetwork?.chainId || "", packagePath],
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

export const useGetRealmPackagesInfinity = (options?: UseInfiniteQueryOptions<any | null, Error>) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useInfiniteQuery<any | null, Error>({
    queryKey: [QUERY_KEY.getRealmPackages, currentNetwork?.chainId || ""],
    getNextPageParam: lastPage => {
      if (!lastPage) {
        return null;
      }

      return lastPage?.pageInfo?.last || null;
    },
    queryFn: async context => {
      if (!realmRepository) {
        return null;
      }
      const cursor = context?.pageParam || null;
      const response = await realmRepository.getRealmPackages(cursor);
      const transactions = response?.transactions.flatMap(tx =>
        tx.messages.map(message => ({
          hash: tx.hash,
          index: tx.index,
          success: tx.success,
          blockHeight: tx.block_height,
          packageName: message.value.package?.name || "",
          packagePath: message.value.package?.path || "",
          creator: message.value.creator,
          functionCount: 0,
          totalCalls: 0,
          totalGasUsed: {
            value: "0",
            denom: "GNOT",
          },
        })),
      );

      return {
        pageInfo: response?.pageInfo,
        transactions: transactions || [],
      };
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
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<RealmTransactionInfo | null, Error>({
    queryKey: [QUERY_KEY.getRealmTransactionInfo, currentNetwork?.chainId || "", packagePath],
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

export const useGetRealmTransactionInfosByFromHeightQuery = (
  fromHeight: number | null | undefined,
  options?: UseQueryOptions<{ [key in string]: RealmTransactionInfo } | null, Error>,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<{ [key in string]: RealmTransactionInfo } | null, Error>({
    queryKey: [QUERY_KEY.getRealmTransactionInfosByFromHeight, currentNetwork?.chainId || "", fromHeight],
    queryFn: async () => {
      if (!realmRepository || !fromHeight) {
        return null;
      }
      const result = await realmRepository.getRealmTransactionInfos(fromHeight);
      return result;
    },
    enabled: !!realmRepository,
    ...options,
  });
};

export const useGetRealmTransactionInfosQuery = (
  options?: UseQueryOptions<{ [key in string]: RealmTransactionInfo } | null, Error>,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<{ [key in string]: RealmTransactionInfo } | null, Error>({
    queryKey: [QUERY_KEY.getRealmFunctions, currentNetwork?.chainId || ""],
    queryFn: async () => {
      if (!realmRepository) {
        return null;
      }
      return await realmRepository.getRealmTransactionInfos();
    },
    enabled: !!realmRepository,
    ...options,
  });
};

export const useGetRealmTransactionsQuery = (
  realmPath: string | null,
  options?: UseQueryOptions<Transaction[], Error>,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<Transaction[], Error>({
    queryKey: [QUERY_KEY.getRealmTransactions, currentNetwork?.chainId || "", realmPath],
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

export const useGetHoldersQuery = (realmPath: string | null, options?: UseQueryOptions<number, Error>) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.getHoldersQuery, currentNetwork?.chainId || "", realmPath],
    queryFn: async () => {
      if (!realmRepository || !realmPath) {
        return 0;
      }

      return realmRepository.getTokenHolders(realmPath);
    },
    enabled: !!realmRepository && !!realmPath,
    ...options,
  });
};

export const useGetRealmTotalSupplyQuery = (realmPath: string | null, options?: UseQueryOptions<number, Error>) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.getRealmTotalSupply, currentNetwork?.chainId || "", realmPath],
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
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<Transaction[], Error>({
    queryKey: [QUERY_KEY.getRealmTransactionsWithArgs, currentNetwork?.chainId || "", realmPath],
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

export const useGetRealmTransactionsByEventQuery = (
  realmPath: string | null,
  options?: UseQueryOptions<Transaction[], Error>,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<Transaction[], Error>({
    queryKey: [QUERY_KEY.getRealmTransactionsByEvent, currentNetwork?.chainId || "", realmPath],
    queryFn: async () => {
      if (!realmRepository || !realmPath) {
        return [];
      }
      const result = await realmRepository.getRealmTransactionsByEvent(realmPath);
      if (!result) {
        return [];
      }

      return result.transactions.map((tx: any) => mapTransactionByRealm(tx));
    },
    select: data => data.sort((item1, item2) => item2.blockHeight - item1.blockHeight),
    enabled: !!realmRepository && !!realmPath,
    ...options,
  });
};

export const useGetRealmTransactionsByEventInfinityQuery = (
  realmPath: string | null,
  options?: UseInfiniteQueryOptions<
    {
      pageInfo: PageInfo;
      transactions: Transaction[];
    },
    Error
  >,
) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useInfiniteQuery<
    {
      pageInfo: PageInfo;
      transactions: Transaction[];
    },
    Error
  >({
    queryKey: [QUERY_KEY.getRealmTransactionsByEvent, currentNetwork?.chainId || "", realmPath],
    getNextPageParam: lastPage => {
      if (!lastPage?.pageInfo?.hasNext) {
        return false;
      }

      return lastPage.pageInfo;
    },
    queryFn: async context => {
      if (!realmRepository || !realmPath) {
        return {
          pageInfo: {
            hasNext: false,
            last: null,
          },
          transactions: [],
        };
      }

      const cursor = context?.pageParam?.last || null;
      const result = await realmRepository.getRealmTransactionsByEvent(realmPath, cursor);
      if (!result) {
        return {
          pageInfo: {
            hasNext: false,
            last: null,
          },
          transactions: [],
        };
      }

      return {
        pageInfo: {
          hasNext: result?.pageInfo?.hasNext || false,
          last: result?.pageInfo?.last || null,
        },
        transactions: result.transactions.map((tx: any) => mapTransactionByRealm(tx)),
      };
    },
    enabled: !!realmRepository && !!realmPath,
    ...options,
  });
};

export const useGetGRC20Tokens = (options?: UseQueryOptions<GRC20Info[], Error>) => {
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<GRC20Info[], Error>({
    queryKey: [QUERY_KEY.getGRC20Tokens, currentNetwork?.chainId || ""],
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
  const { currentNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<
    {
      realmTransaction: RealmTransaction<AddPackageValue>;
      tokenInfo: GRC20Info;
    } | null,
    Error
  >({
    queryKey: [QUERY_KEY.getGRC20Token, currentNetwork?.chainId || "", packagePath],
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
