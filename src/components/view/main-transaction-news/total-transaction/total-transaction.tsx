import React, {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {TotalTransactionModel} from './total-transaction-model';
import usePageQuery from '@/common/hooks/use-page-query';

const BarChart = dynamic(() => import('@/components/ui/chart').then(mod => mod.BarChart), {
  ssr: false,
});

interface TotalTransactionResponse {
  date: string;
  num_txs: number;
}

export const MainTotalTransaction = () => {
  const [totalTransactionModel, setTotalTransactionModel] = useState<TotalTransactionModel>(
    new TotalTransactionModel([]),
  );

  const {data} = usePageQuery<Array<TotalTransactionResponse>>({
    key: 'main/total-transaction',
    uri: 'http://3.218.133.250:7677/latest/info/daily_txs',
    pageable: false,
  });

  useEffect(() => {
    if (data) {
      const responseDatas = data.pages.reduce<Array<TotalTransactionResponse>>(
        (accum, current) => (current ? [...accum, ...current] : accum),
        [],
      );
      updatChartData(responseDatas);
    }
  }, [data]);

  const updatChartData = (responseDatas: Array<TotalTransactionResponse>) => {
    setTotalTransactionModel(new TotalTransactionModel(responseDatas));
  };

  return <BarChart labels={totalTransactionModel.labels} datas={totalTransactionModel.chartData} />;
};
