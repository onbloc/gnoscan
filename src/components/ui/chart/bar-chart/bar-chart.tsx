import React, {useEffect, useRef, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart, ChartData, ChartDataset, ChartOptions, TooltipModel} from 'chart.js';
import {BarChartTooltip} from './tooltip';
import {styled} from '@/styles';
import useTheme from '@/common/hooks/use-theme';
import theme from '@/styles/theme';
import {createRoot, Root} from 'react-dom/client';

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

  const [tooltipRoot, setTooltipRoot] = useState<Root>();

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

  const renderExternalTooltip = (context: {chart: Chart<'bar'>; tooltip: TooltipModel<'bar'>}) => {
    const {chart, tooltip} = context;

    let tooltipEl = document.getElementById('chartjs-tooltip');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.innerHTML = '<table></table>';
      document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    const tooltipModel = tooltip;
    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = '0';
      tooltipEl.remove();
      tooltipRoot?.unmount();
      setTooltipRoot(undefined);
      return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
      tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }

    const position = chart.canvas.getBoundingClientRect();
    tooltipEl.style.opacity = `${tooltipModel.opacity}`;
    tooltipEl.style.position = 'absolute';

    const top = position.top + window.pageYOffset + tooltipModel.caretY;
    tooltipEl.style.top = top + 'px';

    const left = position.left + window.pageXOffset + tooltipModel.caretX;
    if (left + 156 > window.innerWidth) {
      tooltipEl.style.right = '0';
    } else {
      tooltipEl.style.left = left + 'px';
    }

    if (!tooltipRoot) {
      const root = createRoot(tooltipEl);
      setTooltipRoot(root);
      root.render(
        <BarChartTooltip
          themeMode={`${themeMode}`}
          title={tooltip.title[0]}
          value={`${tooltip.dataPoints[0].formattedValue}`}
        />,
      );
    }
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
      <Bar
        ref={chartRef}
        width={chartWidth}
        height={chartHeight}
        options={createChartOption()}
        data={chartData}
      />
      {/* {isTooltip && tooltipData && <BarChartTooltip {...tooltipData} />} */}
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
