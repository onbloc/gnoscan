import React, {useEffect, useState} from 'react';
import {AreaChart} from '@/components/ui/chart';
import {TotalGasShareModel} from './total-gas-share-model';

interface TotalGasShareResponse {
  date: string;
  pkg_path: string;
  pkg_daily_fee: number;
  total_daily_fee: number;
  pct: number;
}

export const MainRealmTotalGasShare = () => {
  const [totalGasShareModel, setTotalGasShareModel] = useState<TotalGasShareModel>(
    new TotalGasShareModel([]),
  );

  useEffect(() => {
    fetchGasShareData();
  }, []);

  const fetchGasShareData = () => {
    try {
      fetch('http://3.218.133.250:7677/v0/info/realms_gas')
        .then(res => res.json())
        .then(res => updatChartData(res));
    } catch (e) {
      console.log(e);
    }
  };

  const updatChartData = (responseDatas: Array<TotalGasShareResponse>) => {
    setTotalGasShareModel(new TotalGasShareModel(responseDatas));
  };

  return (
    <AreaChart
      labels={totalGasShareModel.labels}
      datas={totalGasShareModel.chartData}
      colors={['#ff8f8f', '#ffdede', '#fff481']}
    />
  );
};
