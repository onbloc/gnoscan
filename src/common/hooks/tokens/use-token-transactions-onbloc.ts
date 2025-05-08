import { useMemo } from "react";
import { useQuery } from "react-query";
import { useGetRealmTransactionsByEventInfinityQuery } from "@/common/react-query/realm";
import { useServiceProvider } from "../provider/use-service-provider";
import { Transaction } from "@/types/data-type";

export const useTokenTransactionsInfinity = (path: string[] | string | undefined) => {
  const { blockRepository } = useServiceProvider();

  const packagePath = useMemo(() => {
    if (!path) {
      return null;
    }
    if (Array.isArray(path)) {
      return path.join("/");
    }
    return path;
  }, [path]);

  const {
    data: realmTransactionPages,
    isFetched: isFetchedRealmTransactions,
    hasNextPage,
    fetchNextPage,
  } = useGetRealmTransactionsByEventInfinityQuery(packagePath);

  const transactions = useMemo(() => {
    if (!realmTransactionPages) {
      return [];
    }

    return realmTransactionPages.pages.flatMap(page => page?.transactions || []);
  }, [realmTransactionPages]);

  const { data: transactionWithTimes = null } = useQuery({
    queryKey: ["token/transactions", `${path}`, `${transactions?.length}`],
    queryFn: () =>
      Promise.all(
        transactions?.map(async (transaction: Transaction): Promise<Transaction> => {
          const time = await blockRepository?.getBlockTime(transaction.blockHeight);
          return {
            ...transaction,
            time: time ?? "",
          };
        }) || [],
      ),
    enabled: !!transactions,
    keepPreviousData: true,
  });

  const isFetchedTransactions = useMemo(() => {
    if (!isFetchedRealmTransactions || !transactionWithTimes) {
      return false;
    }

    if (transactions.length === 0) {
      return true;
    }

    return transactionWithTimes.length > 0;
  }, [isFetchedRealmTransactions, transactionWithTimes, transactions]);

  return {
    isFetchedTransactions: isFetchedTransactions,
    transactions: transactionWithTimes,
    hasNextPage,
    nextPage: fetchNextPage,
  };
};
