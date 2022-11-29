import React, {useEffect, useRef, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {ActiveElement, Chart, ChartData, ChartDataset, ChartOptions, TooltipModel} from 'chart.js';
import {BarChartTooltip} from './tooltip';
import {styled} from '@/styles';
import useTheme from '@/common/hooks/use-theme';
import theme from '@/styles/theme';

interface BarChartProps {
  labels: Array<string>;
  datas: Array<{date: string; value: number}>;
}

export const BarChart = ({labels, datas}: BarChartProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart<'bar'>>(null);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({labels: [], datasets: []});
  const [themeMode] = useTheme();

  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [wrapperRef.current?.clientWidth, wrapperRef.current?.clientHeight]);

  useEffect(() => {
    if (chartRef.current) {
      const chartData = createChartData(labels, datas);
      setChartData(chartData);
    }
  }, [chartRef, labels, datas]);

  const handleResize = () => {
    if (wrapperRef.current) {
      setChartWidth(wrapperRef.current.clientWidth);
      setChartHeight(wrapperRef.current.clientHeight);
    }
  };

  const getThemePallet = () => {
    return themeMode === 'light' ? theme.lightTheme : theme.darkTheme;
  };

  const createChartOption = (): ChartOptions<'bar'> => {
    const themePallet = getThemePallet();
    return {
      responsive: true,
      scales: {
        yAxis: {
          ticks: {
            color: themePallet.primary,
            count: 5,
          },
          grid: {
            color: themePallet.dimmed50,
          },
          border: {
            dash: [4, 2],
          },
        },
        xAxis: {
          ticks: {
            display: false,
          },
          grid: {
            color: '#00000000',
          },
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
    };
  };

  const createChartData = (
    labels: Array<string>,
    datasets: Array<{date: string; value: number}>,
  ): ChartData<'bar'> => {
    const themePallet = getThemePallet();
    if (!chartRef.current || !labels || !datasets) {
      return {labels: [], datasets: []};
    }

    const defaultChartData: ChartDataset<'bar'> = {
      yAxisID: 'yAxis',
      xAxisID: 'xAxis',
      borderWidth: 0,
      data: [],
    };

    const mappedDatasets = [
      {
        ...defaultChartData,
        data: datas.map(data => data.value),
        backgroundColor: [themePallet.blue],
        borderColor: themePallet.blue,
        pointBackgroundColor: themePallet.blue,
      },
    ];

    return {
      labels,
      datasets: mappedDatasets,
    };
  };

  return (
    <Wrapper ref={wrapperRef}>
      <Bar
        ref={chartRef}
        width={chartWidth}
        height={chartHeight}
        options={createChartOption()}
        data={chartData}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  & {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;
