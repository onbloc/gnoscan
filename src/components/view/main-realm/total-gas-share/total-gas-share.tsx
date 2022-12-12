import React, {useEffect, useState} from 'react';
import {TotalGasShareModel} from './total-gas-share-model';
import dynamic from 'next/dynamic';
import usePageQuery from '@/common/hooks/use-page-query';
import {API_URI} from '@/common/values/constant-value';

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
    uri: API_URI + '/latest/info/realms_gas',
    pageable: false,
  });

  useEffect(() => {
    if (data) {
      const responseDatas = data.pages.reduce<Array<TotalGasShareResponse>>(
        (accum, current) => (current ? [...accum, ...current] : accum),
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
      colors={['#2090F3', '#786AEC', '#FDD15C', '#617BE3', '#30BDD2', '#83CFAA']}
    />
  );
};
