import React, {useEffect, useRef, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {ActiveElement, Chart, ChartData, ChartDataset, ChartOptions, TooltipModel} from 'chart.js';
import {AreaChartTooltip} from './tooltip';
import {styled} from '@/styles';
import useTheme from '@/common/hooks/use-theme';
import theme from '@/styles/theme';

interface AreaChartProps {
  labels: Array<string>;
  datas: {[key in string]: Array<{value: number; rate: number}>};
  colors?: Array<string>;
}

export const AreaChart = ({labels, datas, colors = []}: AreaChartProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart<'line'>>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({labels: [], datasets: []});
  const [tooltip, setTooltip] = useState<TooltipModel<'line'>>();
  const [elements, setElements] = useState<Array<ActiveElement>>([]);
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
      setTooltip(chartRef.current.tooltip);
    }
  }, [chartRef, labels, datas]);

  const handleResize = () => {
    if (wrapperRef.current) {
      setChartWidth(wrapperRef.current.clientWidth);
      setChartHeight(wrapperRef.current.clientHeight);
    }
  };

  const updateTooltip = (tooltip: TooltipModel<'line'>) => {
    if (tooltip.getActiveElements().length !== elements.length) {
      setElements(tooltip.getActiveElements());
      return;
    }
    if (
      tooltip.getActiveElements().length !== 0 &&
      tooltip.getActiveElements()[0].index !== elements[0].index
    ) {
      setElements(tooltip.getActiveElements());
    }
  };

  const getThemePallet = () => {
    return themeMode === 'light' ? theme.lightTheme : theme.darkTheme;
  };

  const createChartOption = (): ChartOptions<'line'> => {
    const themePallet = getThemePallet();
    return {
      responsive: true,
      scales: {
        yAxis: {
          max: 100,
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
            color: themePallet.primary,
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
          position: 'bottom' as const,
          labels: {
            boxHeight: 4,
            boxWidth: 4,
            color: themePallet.primary,
            pointStyle: 'circle',
            usePointStyle: true,
          },
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          displayColors: false,
          external: context => updateTooltip(context.tooltip),
        },
        title: {
          display: false,
        },
      },
    };
  };

  const createChartData = (
    labels: Array<string>,
    datasets: {[key in string]: Array<{value: number; rate: number}>},
  ): ChartData<'line'> => {
    const themePallet = getThemePallet();
    if (!chartRef.current || !labels || !datasets) {
      return {labels: [], datasets: []};
    }

    const chart = chartRef.current;
    const defaultChartData: ChartDataset<'line'> = {
      yAxisID: 'yAxis',
      xAxisID: 'xAxis',
      fill: true,
      borderWidth: 2,
      pointBorderWidth: 1,
      pointRadius: 1,
      data: [],
    };

    const chartColors = [
      ...colors,
      ...new Array(Object.keys(datasets).length).fill(themePallet.blue),
    ];
    const mappedDatasets = Object.keys(datasets).map((datasetName, index) => {
      const currentDataset = datasets[datasetName].map(dataset => dataset.rate);
      return {
        ...defaultChartData,
        label: datasetName,
        data: currentDataset,
        borderColor: chartColors[index],
        pointBackgroundColor: chartColors[index],
        backgroundColor: createGradient(chart, currentDataset, chartColors[index]),
      };
    });

    return {
      labels,
      datasets: mappedDatasets,
    };
  };

  const createGradient = (chart: Chart<'line'>, datas: Array<number>, colorStart: string) => {
    const maxValue = Math.max(...datas);
    const top = chart.chartArea.bottom - Math.round(chart.chartArea.bottom * (maxValue / 100));
    const gradient = chart.ctx.createLinearGradient(0, top, 0, chart.chartArea.bottom);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, `${colorStart.slice(0, 7)}22`);
    return gradient;
  };

  return (
    <Wrapper ref={wrapperRef}>
      {tooltip && <AreaChartTooltip tooltip={tooltip} datas={datas} />}
      <Line
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
