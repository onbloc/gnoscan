import React, {useEffect, useRef, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart, ChartData, ChartDataset, ChartOptions, TooltipModel} from 'chart.js';
import {BarChartTooltip} from './tooltip';
import {styled} from '@/styles';
import theme from '@/styles/theme';
import {useRecoilState} from 'recoil';
import {themeState} from '@/states';
interface BarChartProps {
  labels: Array<string>;
  datas: Array<{date: string; value: number}>;
  isDenom?: boolean;
}

export const BarChart = ({labels, datas, isDenom}: BarChartProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart<'bar'>>(null);
  const [chartData, setChartData] = useState<ChartData<'bar'>>({labels: [], datasets: []});
  const [themeMode, setThemeMode] = useRecoilState(themeState);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState({
    title: '',
    value: '',
  });

  useEffect(() => {
    window.addEventListener('scroll', handleTooltipVisible);
    return () => {
      window.removeEventListener('scroll', handleTooltipVisible);
    };
  }, [tooltipRef]);

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

  const handleTooltipVisible = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = '0';
    }
  };

  const handleResize = () => {
    if (wrapperRef.current) {
      setChartWidth(wrapperRef.current.clientWidth);
      setChartHeight(wrapperRef.current.clientHeight);
    }
  };

  const getThemePallet = () => {
    return themeMode === 'light' ? theme.lightTheme : theme.darkTheme;
  };

  const renderExternalTooltip = (context: {chart: Chart<'bar'>; tooltip: TooltipModel<'bar'>}) => {
    const {chart, tooltip} = context;

    if (!tooltipRef.current) {
      return;
    }

    const currentTooltip = tooltipRef.current;

    const tooltipModel = tooltip;
    if (tooltipModel.opacity === 0) {
      currentTooltip.style.opacity = '0';
      return;
    }

    if (
      tooltip.title[0] !== currentValue.title ||
      tooltip.dataPoints[0].formattedValue !== currentValue.value
    ) {
      setCurrentValue({
        title: tooltip.title[0],
        value: `${tooltip.dataPoints[0].formattedValue}`,
      });
    }

    currentTooltip.style.opacity = '1';

    const tooltipRect = currentTooltip.getBoundingClientRect();
    const position = chart.canvas.getBoundingClientRect();
    currentTooltip.style.position = 'absolute';
    currentTooltip.style.marginTop = -position.height + 'px';

    const left = tooltipModel.caretX - tooltipModel.width / 2;
    const leftLimit = position.width - tooltipRect.width + 20;
    if (left + tooltipRect.width > position.width) {
      currentTooltip.style.left = leftLimit + 'px';
    } else {
      currentTooltip.style.left = left + 'px';
    }
  };

  const createChartOption = (): ChartOptions<'bar'> => {
    const themePallet = getThemePallet();
    return {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      scales: {
        yAxis: {
          ticks: {
            color: themePallet.tertiary,
            count: 5,
            format: {
              minimumFractionDigits: 0,
              maximumFractionDigits: 6,
            },
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
        tooltip: {
          enabled: false,
          position: 'average',
          displayColors: false,
          external: renderExternalTooltip,
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
      <div className="tooltip-container" ref={tooltipRef} style={{opacity: 0}}>
        <BarChartTooltip
          isDenom={isDenom}
          themeMode={`${themeMode}`}
          title={currentValue.title}
          value={currentValue.value}
        />
      </div>
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
    display: flex;
    width: 100%;
    height: calc(100% - 40px);
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .tooltip-container {
      position: absolute;
      display: flex;
      width: fit-content;
      height: fit-content;
      z-index: 9;
    }
  }
`;
