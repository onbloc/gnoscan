import {BarChart} from '@/components/ui/chart';
import React, {useEffect, useState} from 'react';
import {TotalDailyFeeModel} from './total-daily-fee-model';

interface TotalDailyFeeResponse {
  date: string;
  gas_fee: number;
}

export const MainTotalDailyFee = () => {
  const [totalDailyFeeModel, setTotalDailyFeeModel] = useState<TotalDailyFeeModel>(
    new TotalDailyFeeModel([]),
  );

  useEffect(() => {
    fetchGasShareData();
  }, []);

  const fetchGasShareData = () => {
    try {
      fetch('http://3.218.133.250:7677/v3/info/daily_fees')
        .then(res => res.json())
        .then(res => updatChartData(res));
    } catch (e) {
      console.log(e);
    }
  };

  const updatChartData = (responseDatas: Array<TotalDailyFeeResponse>) => {
    setTotalDailyFeeModel(new TotalDailyFeeModel(responseDatas));
  };

  return <BarChart labels={totalDailyFeeModel.labels} datas={totalDailyFeeModel.chartData} />;
};
