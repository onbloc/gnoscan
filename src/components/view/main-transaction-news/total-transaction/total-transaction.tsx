import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/loading";
import { useTotalDailyInfo } from "@/common/hooks/main/use-total-daily-info";
import { DAY_TIME } from "@/common/values/constant-value";
import { dateToStr } from "@/common/utils/date-util";

const BarChart = dynamic(() => import("@/components/ui/chart").then(mod => mod.BarChart), {
  ssr: false,
});

export const MainTotalTransaction = () => {
  const { isFetched, transactionInfo } = useTotalDailyInfo();

  const labels = useMemo(() => {
    const now = new Date();
    const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const beforeMonthTime = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime();
    const barCount = Math.round((now.getTime() - beforeMonthTime) / DAY_TIME);

    return Array.from({ length: barCount })
      .map((_, index) => new Date(todayTime - DAY_TIME * index))
      .sort((d1, d2) => d1.getTime() - d2.getTime())
      .map(dateToStr);
  }, []);

  const chartData = useMemo(() => {
    return labels.map(label => {
      const info = transactionInfo.find(info => info.date === label);
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
    <React.Fragment>
      {isFetched ? <BarChart labels={labels} datas={chartData} /> : <Spinner position="center" />}
    </React.Fragment>
  );
};
