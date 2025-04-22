/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useGetRealmTransactionsWithArgsQuery } from "@/common/react-query/realm";
import { useServiceProvider } from "../provider/use-service-provider";

export const useTokenTransactions = (path: string[] | string | undefined) => {
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

  const { data: realmTransactions, isFetched: isFetchedTransactions } =
    useGetRealmTransactionsWithArgsQuery(packagePath);
  const [currentPage, setCurrentPage] = useState(0);

  const hasNextPage = useMemo(() => {
    if (!realmTransactions) {
      return false;
    }

    return realmTransactions.length > (currentPage + 1) * 20;
  }, [currentPage, realmTransactions?.length]);

  const transactions = useMemo(() => {
    if (!realmTransactions) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = realmTransactions.length > nextIndex ? nextIndex : realmTransactions.length;
    return realmTransactions
      .filter((_: any, index: number) => index < endIndex)
      .map(tx => ({
        ...tx,
      }));
  }, [realmTransactions?.length, currentPage]);

  const { data: transactionWithTimes = null, isFetched: isFetchedTransactionWithTimes } = useQuery({
    queryKey: ["token/transactions", `${path}`, `${transactions?.length}`],
    queryFn: () =>
      Promise.all(
        transactions?.map(async transaction => {
          const time = await blockRepository?.getBlockTime(transaction.blockHeight);
          return {
            ...transaction,
            time,
          };
        }) || [],
      ),
    enabled: !!transactions,
    keepPreviousData: true,
  });

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    isFetchedTransactions: isFetchedTransactions && transactions.length === transactionWithTimes?.length,
    transactions: transactionWithTimes,
    hasNextPage,
    nextPage,
  };
};
