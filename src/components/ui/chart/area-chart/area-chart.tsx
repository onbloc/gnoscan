import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {Chart, ChartData, ChartDataset, ChartOptions, TooltipModel} from 'chart.js';
import {AreaChartTooltip} from './tooltip';
import theme from '@/styles/theme';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {zindex} from '@/common/values/z-index';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import {formatAddress} from '@/common/utils';
interface AreaChartProps {
  labels: Array<string>;
  datas: {[key in string]: Array<{value: number; rate: number}>};
  colors?: Array<string>;
}

export function makeAreaGraphDisplayLabel(label: string) {
  const values = label.split('/');
  if (values.length > 3) {
    const [blank, packageType, namespace, ...rest] = values;
    if (namespace.length > 10) {
      return [blank, packageType, formatAddress(namespace), ...rest].join('/');
    }
  }
  return label;
}

export const AreaChart = ({labels, datas, colors = []}: AreaChartProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart<'line'>>(null);
  const [excludedDatasets, setExcludedDatasets] = useState<ChartDataset[]>([]);
  const [chartData, setChartData] = useState<ChartData<'line'>>({labels: [], datasets: []});
  const themeMode = useRecoilValue(themeState);

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
    if (chartRef.current) {
      const chartData = createChartData(labels, datas);
      setChartData(chartData);
    }
  }, [chartRef, labels, datas, excludedDatasets]);

  const onClickLegend = useCallback(
    (dataset: ChartDataset) => {
      const index = excludedDatasets.findIndex(
        excludedDataset => excludedDataset.label === dataset.label,
      );
      if (index > -1) {
        const changedDatasets = [...excludedDatasets];
        changedDatasets.splice(index, 1);
        setExcludedDatasets(changedDatasets);
        return;
      }
      setExcludedDatasets([...excludedDatasets, dataset]);
    },
    [excludedDatasets],
  );

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
          ticks: {
            color: themePallet.tertiary,
            count: 5,
            callback: (tickValue, index) => {
              if (index === 0) return '';
              return BigNumber(tickValue).shiftedBy(-6).toString();
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
            color: themePallet.tertiary,
            count: 1,
            maxTicksLimit: 10,
            maxRotation: 0,
            callback: (_, index) => {
              try {
                const formatter = new Intl.DateTimeFormat('en-us', {
                  month: 'short',
                  day: 'numeric',
                });
                return formatter.format(new Date(labels[index]));
              } catch (e) {}
              return index;
            },
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
      const currentDataset = datasets[datasetName].map(dataset => dataset.value);
      return {
        ...defaultChartData,
        label: datasetName,
        data: currentDataset,
        borderColor: chartColors[index],
        pointBackgroundColor: chartColors[index],
        backgroundColor: chartColors[index],
      };
    });

    const stackedDatasets = mappedDatasets.map((dataset, datasetIndex) => {
      const data = dataset.data.map((_, dataIndex) => {
        let result = BigNumber(0);
        for (let i = 0; i <= datasetIndex; i++) {
          if (excludedDatasets.findIndex(item => item.label === mappedDatasets[i].label) === -1) {
            result = result.plus(mappedDatasets[i].data[dataIndex]);
          }
        }
        return result.shiftedBy(6).toNumber();
      });
      return {
        ...dataset,
        data,
      };
    });

    return {
      labels,
      datasets: stackedDatasets,
    };
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
        className="area-chart"
        width={'100%'}
        height={'100%'}
        options={createChartOption()}
        data={chartData}
      />

      <div className="legend-list-wrapper">
        {chartData.datasets.map((dataset, index) => (
          <LegendWrapper
            key={index}
            fill={`${dataset?.borderColor}`}
            disabled={excludedDatasets.findIndex(item => item.label === dataset.label) > -1}
            onClick={() => onClickLegend(dataset)}>
            <span className="legend-mark"></span>
            <span className="legend-name">{makeAreaGraphDisplayLabel(dataset.label || '')}</span>
          </LegendWrapper>
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  & {
    position: relative;
    display: flex;
    flex-direction: column;
    height: calc(100% - 75px);
    justify-content: center;
    align-items: center;
    overflow: visible;
  }

  .area-chart {
    display: block;
  }

  .legend-list-wrapper {
    position: absolute;
    bottom: -50px;
    display: flex;
    flex-flow: row wrap;
    flex-direction: row;
    width: 100%;
    height: 40px;
    color: ${({theme}) => theme.colors.white};
    ${({theme}) => theme.fonts.body1};
    align-items: flex-start;
    justify-content: center;
  }

  .tooltip-container {
    position: absolute;
    display: flex;
    width: fit-content;
    height: fit-content;
    z-index: ${zindex.chart};
    pointer-events: none;
  }
`;

const LegendWrapper = styled.div<{fill: string; disabled: boolean}>`
  display: flex;
  height: 20px;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
  user-select: none;

  ${({disabled}) => disabled && 'text-decoration: line-through;'}

  .legend-mark {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background-color: ${({fill}) => fill};
    margin-right: 5px;
  }
  .legend-name {
    color: ${({theme}) => theme.colors.primary};
  }
`;
