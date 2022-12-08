import React, {useEffect, useState} from 'react';
import {TotalGasShareModel} from './total-gas-share-model';
import dynamic from 'next/dynamic';
import usePageQuery from '@/common/hooks/use-page-query';

const AreaChart = dynamic(() => import('@/components/ui/chart').then(mod => mod.AreaChart), {
  ssr: false,
});

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

  const {data} = usePageQuery<Array<TotalGasShareResponse>>({
    key: 'main/total-gas-share',
    uri: 'http://3.218.133.250:7677/latest/info/realms_gas',
    pageable: false,
  });

  useEffect(() => {
    if (data) {
      const responseDatas = data.pages.reduce<Array<TotalGasShareResponse>>(
        (accum, current) => [...accum, ...current],
        [],
      );
      updatChartData(responseDatas);
    }
  }, [data]);

  const updatChartData = (responseDatas: Array<TotalGasShareResponse>) => {
    setTotalGasShareModel(new TotalGasShareModel(responseDatas));
  };

  return (
    <AreaChart
      labels={totalGasShareModel.labels}
      datas={totalGasShareModel.chartData}
      colors={[]}
    />
  );
};
