import React, {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {TotalTransactionModel} from './total-transaction-model';
import usePageQuery from '@/common/hooks/use-page-query';
import {API_URI, API_VERSION} from '@/common/values/constant-value';
import {Spinner} from '@/components/ui/loading';

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

  const {data, finished} = usePageQuery<Array<TotalTransactionResponse>>({
    key: 'main/total-transaction',
    uri: API_URI + API_VERSION + '/info/daily_txs',
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

  return (
    <>
      {finished ? (
        <BarChart labels={totalTransactionModel.labels} datas={totalTransactionModel.chartData} />
      ) : (
        <Spinner position="center" />
      )}
    </>
  );
};
