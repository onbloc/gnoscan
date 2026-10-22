import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { parseTokenAmount } from "@/common/utils/token.utility";
import { AccountTransactionResponse, IAccountRepository } from "@/repositories/account-repository";
import { Amount, Transaction } from "@/types/data-type";
import { UseQueryOptions, useQuery } from "react-query";
import { QUERY_KEY } from "./types";

export const useGetNativeTokenBalance = (address: string, options?: UseQueryOptions<Amount, Error>) => {
  const { currentNetwork } = useNetworkProvider();
  const { accountRepository } = useServiceProvider();

  return useQuery<Amount, Error>({
    queryKey: [QUERY_KEY.getNativeBalances, currentNetwork?.rpcUrl || "", currentNetwork?.indexerUrl || "", address],
    queryFn: () => {
      if (!accountRepository) {
        return {
          value: "0",
          denom: GNOTToken.denom,
        };
      }

      return accountRepository
        .getNativeTokensBalances(address)
        .then(result => {
          const amountValue = parseTokenAmount(result || "0", GNOTToken.denom).toString();
          return {
            value: amountValue,
            denom: GNOTToken.denom,
          };
        })
        .catch(() => ({
          value: "0",
          denom: GNOTToken.denom,
        }));
    },
    enabled: !!accountRepository,
    ...options,
  });
};

export const useGetGRC20TokenBalances = (address: string, options?: UseQueryOptions<Amount[], Error>) => {
  const { currentNetwork } = useNetworkProvider();
  const { accountRepository } = useServiceProvider();

  return useQuery<Amount[], Error>({
    queryKey: [QUERY_KEY.getGRC20Balances, currentNetwork?.rpcUrl || "", currentNetwork?.indexerUrl || "", address],
    queryFn: async () => {
      if (!accountRepository) {
        return [];
      }

      const assets = await accountRepository.getGRC20ReceivedPackagePaths(address).catch(() => null);

      return accountRepository.getGRC20TokensBalances(address, assets || []);
    },
    enabled: !!accountRepository,
    ...options,
  });
};

// Custom networks have no account transactions query, so the four per type queries are merged by block height
const fetchCustomNetworkTransactions = async (
  accountRepository: IAccountRepository,
  address: string,
): Promise<Transaction[]> => {
  const transactions = await Promise.all([
    accountRepository.getGRC20ReceivedTransactionsByAddress(address),
    accountRepository.getNativeTokenReceivedTransactionsByAddress(address),
    accountRepository.getNativeTokenSendTransactionsByAddress(address),
    accountRepository.getVMTransactionsByAddress(address),
  ])
    .then(results => results.flatMap(result => result ?? []))
    .catch((): Transaction[] => []);

  const transactionMap = transactions.reduce<{ [key in number]: Transaction }>((accum, current) => {
    if (!accum[current.blockHeight]) {
      accum[current.blockHeight] = current;
    }
    return accum;
  }, {});

  return Object.values(transactionMap);
};

export const fetchIndexerTransactions = async (
  accountRepository: IAccountRepository,
  address: string,
): Promise<Transaction[]> => {
  const emptyPage: AccountTransactionResponse = { transactions: [], pageInfo: { last: null, hasNext: false } };
  const transactions: Transaction[] = [];
  let hasNext = true;
  let lastCursor: string | null = null;

  while (hasNext) {
    const result: AccountTransactionResponse = await accountRepository
      .getAccountTransactions(address, lastCursor)
      .catch(() => emptyPage);
    const { last } = result.pageInfo;

    transactions.push(...result.transactions);
    // Stop when the cursor does not advance, otherwise the first page is fetched forever
    hasNext = result.pageInfo.hasNext && !!last && last !== lastCursor;
    lastCursor = last;
  }

  return transactions;
};

export const useGetAccountTransactions = (address: string, options?: UseQueryOptions<Transaction[], Error>) => {
  const { currentNetwork, isCustomNetwork } = useNetworkProvider();
  const { accountRepository } = useServiceProvider();

  return useQuery<Transaction[], Error>({
    queryKey: [
      QUERY_KEY.getAccountTransactions,
      currentNetwork?.rpcUrl || "",
      currentNetwork?.indexerUrl || "",
      address,
    ],
    queryFn: () => {
      if (!accountRepository) {
        return [];
      }

      return isCustomNetwork
        ? fetchCustomNetworkTransactions(accountRepository, address)
        : fetchIndexerTransactions(accountRepository, address);
    },
    enabled: !!accountRepository && !!address,
    keepPreviousData: true,
    ...options,
  });
};
