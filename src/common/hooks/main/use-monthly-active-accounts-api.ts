import { useMemo } from "react";
import { useGetMonthlyTransactionStatInfo } from "../common/use-get-monthly-transaction-stat-info";
import { MonthlyAccountTransaction } from "@/types/data-type";

export const useMonthlyActiveAccountsApi = () => {
  const { data: statInfo, isFetched } = useGetMonthlyTransactionStatInfo();

  const activeUsers: MonthlyAccountTransaction[] = useMemo(() => {
    if (!statInfo) {
      return [];
    }

    return statInfo?.accounts || [];
  }, [statInfo]);

  return {
    isFetched,
    data: activeUsers,
  };
};
