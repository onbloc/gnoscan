import React, {useEffect, useState} from 'react';
import {TotalDailyFeeModel} from './total-daily-fee-model';
import dynamic from 'next/dynamic';
import usePageQuery from '@/common/hooks/use-page-query';
import {API_URI} from '@/common/values/constant-value';

const BarChart = dynamic(() => import('@/components/ui/chart').then(mod => mod.BarChart), {
  ssr: false,
});

interface TotalDailyFeeResponse {
  date: string;
  gas_fee: number;
}

export const MainTotalDailyFee = () => {
  const [totalDailyFeeModel, setTotalDailyFeeModel] = useState<TotalDailyFeeModel>(
    new TotalDailyFeeModel([]),
  );

  const {data} = usePageQuery<Array<TotalDailyFeeResponse>>({
    key: 'main/total-daily-fee',
    uri: API_URI + '/latest/info/daily_fees',
    pageable: false,
  });

  useEffect(() => {
    if (data) {
      const responseDatas = data.pages.reduce<Array<TotalDailyFeeResponse>>(
        (accum, current) => (current ? [...accum, ...current] : accum),
        [],
      );
      updatChartData(responseDatas);
    }
  }, [data]);

  const updatChartData = (responseDatas: Array<TotalDailyFeeResponse>) => {
    setTotalDailyFeeModel(new TotalDailyFeeModel(responseDatas));
  };

  return (
    <BarChart isDenom labels={totalDailyFeeModel.labels} datas={totalDailyFeeModel.chartData} />
  );
};
