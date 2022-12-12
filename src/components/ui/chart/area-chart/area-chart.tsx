import React, {useEffect, useRef, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {Chart, ChartData, ChartDataset, ChartOptions, TooltipModel} from 'chart.js';
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
  const [themeMode] = useTheme();
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState({
    title: '',
    value: [] as any,
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

  const handleResize = () => {
    if (wrapperRef.current) {
      setChartWidth(wrapperRef.current.clientWidth);
      if (wrapperRef.current.clientHeight > 250) {
        setChartHeight(wrapperRef.current.clientHeight);
      }
    }
  };

  const handleTooltipVisible = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = '0';
    }
  };

  const getThemePallet = () => {
    return themeMode === 'light' ? theme.lightTheme : theme.darkTheme;
  };

  const renderExternalTooltip = (context: {
    chart: Chart<'line'>;
    tooltip: TooltipModel<'line'>;
  }) => {
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

    if (tooltip.title[0] !== currentValue.title) {
      setCurrentValue({
        title: tooltip.title[0],
        value: tooltip.getActiveElements(),
      });
    }

    currentTooltip.style.opacity = '1';

    const tooltipRect = currentTooltip.getBoundingClientRect();
    const position = chart.canvas.getBoundingClientRect();
    currentTooltip.style.position = 'fixed';
    currentTooltip.style.top = position.bottom - position.height - tooltip.height + 'px';

    const left = tooltipModel.caretX - position.width / 2;
    if (left + tooltipRect.width > position.width) {
      currentTooltip.style.marginRight = '0';
    } else {
      currentTooltip.style.marginLeft = left + 'px';
    }
  };

  const createChartOption = (): ChartOptions<'line'> => {
    const themePallet = getThemePallet();
    return {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      scales: {
        yAxis: {
          max: 100,
          min: 0,
          ticks: {
            color: themePallet.tertiary,
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
            color: themePallet.tertiary,
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
          position: 'average',
          displayColors: false,
          external: renderExternalTooltip,
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
      borderWidth: 1,
      pointBorderWidth: 0,
      pointHitRadius: 0,
      pointHoverRadius: 2,
      pointHoverBorderWidth: 1,
      pointHoverBackgroundColor: '#FFFFFF',
      pointRadius: 0,
      data: [],
      tension: 0.4,
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
    gradient.addColorStop(1, `${colorStart.slice(0, 7)}00`);
    return gradient;
  };

  return (
    <Wrapper ref={wrapperRef}>
      <div className="tooltip-container" ref={tooltipRef} style={{opacity: 0}}>
        <AreaChartTooltip
          themeMode={`${themeMode}`}
          title={currentValue.title}
          activeElements={currentValue.value}
          chartColors={[...colors, ...new Array(Object.keys(datas).length).fill('#2090F3')]}
          datas={datas}
        />
      </div>
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
    display: flex;
    width: 100%;
    height: calc(100% - 40px);
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .tooltip-container {
    position: absolute;
    display: flex;
    width: fit-content;
    height: fit-content;
    z-index: 20;
    pointer-events: none;
  }
`;
