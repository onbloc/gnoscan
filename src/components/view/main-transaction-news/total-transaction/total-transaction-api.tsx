import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/loading";
import { useGetTotalDailyTransactions } from "@/common/react-query/statistics";
import { StatisticsEmptyState, StatisticsQueryState } from "@/components/view/statistics/statistics-query-state";

const BarChart = dynamic(() => import("@/components/ui/chart").then(mod => mod.BarChart), {
  ssr: false,
});

export const MainTotalTransactionApi = () => {
  const query = useGetTotalDailyTransactions();
  const { data: transactionInfo } = query;
  const isFetched = transactionInfo !== undefined;

  const labels = useMemo(() => {
    if (!transactionInfo?.items || transactionInfo.items.length === 0) return [];

    return [...transactionInfo.items]
      .map(item => item.date)
      .sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });
  }, [transactionInfo?.items]);

  const chartData = useMemo(() => {
    if (!transactionInfo?.items) return [];
    return labels.map(label => {
      const info = transactionInfo.items.find(info => info.date === label);
      if (!info) {
        return {
          date: label,
          value: 0,
        };
      }
      return {
        date: label,
        value: info.txCount,
      };
    });
  }, [labels, transactionInfo]);

  return (
    <StatisticsQueryState query={query}>
      {!isFetched ? (
        <Spinner position="center" />
      ) : labels.length === 0 ? (
        <StatisticsEmptyState />
      ) : (
        <BarChart labels={labels} datas={chartData} />
      )}
    </StatisticsQueryState>
  );
};
