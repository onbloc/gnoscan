import React, {useEffect, useState} from 'react';
import {TotalGasShareModel} from './total-gas-share-model';
import dynamic from 'next/dynamic';
import usePageQuery from '@/common/hooks/use-page-query';
import {API_URI, API_VERSION} from '@/common/values/constant-value';
import styled from 'styled-components';
import Text from '@/components/ui/text';
import theme from '@/styles/theme';
import {Spinner} from '@/components/ui/loading';
import {ValueWithDenomType} from '@/types/data-type';

const AreaChart = dynamic(() => import('@/components/ui/chart').then(mod => mod.AreaChart), {
  ssr: false,
});
interface TotalGasShareResponse {
  date: string;
  daily_total_fee: ValueWithDenomType;
  packages: Array<{
    path: string;
    daily_fee: number;
    percent: number;
  }>;
}

export const MainRealmTotalGasShare = () => {
  const [period, setPeriod] = useState(7);

  const [totalGasShareModel, setTotalGasShareModel] = useState<TotalGasShareModel>(
    new TotalGasShareModel([]),
  );

  const {data, finished} = usePageQuery<Array<TotalGasShareResponse>>({
    key: 'main/total-gas-share',
    uri: API_URI + API_VERSION + `/info/realms_gas?period=${period}`,
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

  const onClickPeriod = (currentPeriod: number) => {
    if (period !== currentPeriod) {
      setPeriod(currentPeriod);
    }
  };

  const updatChartData = (responseDatas: Array<TotalGasShareResponse>) => {
    setTotalGasShareModel(new TotalGasShareModel(responseDatas));
  };

  return (
    <Wrapper>
      <div className="title-wrapper">
        <Text className="title" type="h6" color="primary">
          {'Total Gas Share By Realms (in GNOTs)'}
        </Text>
        <div className="period-selector">
          <span className={period === 7 ? 'active' : ''} onClick={() => onClickPeriod(7)}>
            7D
          </span>
          <span className={period === 30 ? 'active' : ''} onClick={() => onClickPeriod(30)}>
            30D
          </span>
        </div>
      </div>
      {finished ? (
        <AreaChart
          labels={totalGasShareModel.labels}
          datas={totalGasShareModel.chartData}
          colors={['#2090F3', '#786AEC', '#FDD15C', '#617BE3', '#30BDD2', '#83CFAA']}
        />
      ) : (
        <Spinner position="center" />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & .title-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
  }

  & .period-selector {
    display: flex;
    color: ${({theme}) => theme.colors.tertiary};

    span {
      width: 60px;
      height: 30px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: 1px solid ${({theme}) => theme.colors.tertiary};
      ${theme.fonts.p4};
      cursor: pointer;

      &.active {
        cursor: auto;
        background-color: ${({theme}) => theme.colors.select};
      }

      &:first-child {
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        border-right: none;
      }

      &:last-child {
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        border-left: none;
      }
    }
  }
`;
