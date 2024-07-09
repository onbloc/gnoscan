import React, {useMemo} from 'react';
import dynamic from 'next/dynamic';
import {Spinner} from '@/components/ui/loading';
import {useTotalDailyInfo} from '@/common/hooks/main/use-total-daily-info';
import BigNumber from 'bignumber.js';
import {GNOTToken} from '@/common/hooks/common/use-token-meta';
import {DAY_TIME} from '@/common/values/constant-value';

const BarChart = dynamic(() => import('@/components/ui/chart').then(mod => mod.BarChart), {
  ssr: false,
});

const BAR_COUNT = 30;

export const MainTotalDailyFee = () => {
  const {isFetched, transactionInfo} = useTotalDailyInfo();

  const labels = useMemo(() => {
    const now = new Date();
    const todayTime = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).getTime();

    return Array.from({length: BAR_COUNT})
      .map((_, index) => new Date(todayTime - DAY_TIME * index))
      .sort((d1, d2) => d1.getTime() - d2.getTime())
      .map(date => {
        return [date.getFullYear(), date.getMonth(), date.getDate()].join('-');
      });
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
        value: BigNumber(info.gasFee.value)
          .shiftedBy(GNOTToken.decimals * -1)
          .toNumber(),
      };
    });
  }, [labels, transactionInfo]);

  return (
    <React.Fragment>
      {isFetched ? (
        <BarChart isDenom labels={labels} datas={chartData} />
      ) : (
        <Spinner position="center" />
      )}
    </React.Fragment>
  );
};
