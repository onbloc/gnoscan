import {ValueWithDenomType} from '@/types/data-type';
import BigNumber from 'bignumber.js';

interface TotalGasShareData {
  date: string;
  packagePath: string;
  packageDailyFee: number;
  totalDailyFee: number;
  percent: number;
}

type GraphDataSet = {[key in string]: GraphData[]};

interface GraphData {
  value: number;
  stackedValue: number;
  rate: number;
}

export class TotalGasShareModel {
  private static FILTERED_LIMIT = 100;

  private datas: Array<TotalGasShareData>;

  constructor(
    responseDatas: Array<{
      date: string;
      daily_total_fee: ValueWithDenomType;
      packages: Array<{
        path: string;
        daily_fee: number;
        percent: number;
      }>;
    }>,
  ) {
    this.datas = [];
    responseDatas.forEach(response => this.datas.push(...TotalGasShareModel.createDatas(response)));
  }

  public get = () => {
    return this.datas;
  };

  public get labels() {
    const labels = Array.from(new Set(this.datas.map(data => data.date)));
    return labels.sort();
  }

  public get modelSetOfPackagePath() {
    const initValue: {[key in string]: Array<TotalGasShareData>} = {};
    const modelSet = this.datas.reduce(
      (accum: {[key in string]: Array<TotalGasShareData>}, current) => {
        if (!accum[current.packagePath]) {
          accum[current.packagePath] = [];
        }
        accum[current.packagePath].push(current);
        return accum;
      },
      initValue,
    );

    return modelSet;
  }

  public get sortedPackagePath() {
    const modelSet = this.modelSetOfPackagePath;
    const medelPackagePaths = Object.keys(modelSet);
    const packagePathOfDailyFee = medelPackagePaths.reduce(
      (accum: Array<{packagePath: string; dailyFee: number}>, currentPackagePath) => {
        const dailyFee = modelSet[currentPackagePath].reduce(
          (accum, current) => accum + current.packageDailyFee,
          0,
        );
        accum.push({
          packagePath: currentPackagePath,
          dailyFee,
        });
        return accum;
      },
      [] as Array<{packagePath: string; dailyFee: number}>,
    );

    return packagePathOfDailyFee
      .sort((d1, d2) => d1.dailyFee - d2.dailyFee)
      .map(data => data.packagePath);
  }

  public get chartData() {
    const labels = this.labels;
    const rankPackagePaths = this.sortedPackagePath.reverse();

    const datasets = rankPackagePaths.reduce((accum: GraphDataSet, currentPackagePath) => {
      if (!accum[currentPackagePath]) {
        accum[currentPackagePath] = new Array(labels.length).fill({
          value: 0,
          stackedValue: 0,
          rate: 0,
        });
      }

      for (let dateIndex = 0; dateIndex < labels.length; dateIndex++) {
        // Filter all data by comparing dates to the package paths that need to be calculated cumulatively.
        const result = this.datas
          .filter(({date}) => date === labels[dateIndex])
          .filter(({packagePath}) =>
            rankPackagePaths
              .slice(
                0,
                rankPackagePaths.findIndex(filteredPath => filteredPath === currentPackagePath) + 1,
              )
              .includes(packagePath),
          );

        const currentData = result.find(data => data.packagePath === currentPackagePath);
        const dailyFessOfDate = result.map(data => data.packageDailyFee);

        accum[currentPackagePath][dateIndex] = {
          value: currentData?.packageDailyFee ?? 0,
          stackedValue: dailyFessOfDate.reduce((a, b) => BigNumber(a).plus(b).toNumber(), 0),
          rate: currentData?.percent ?? 0,
        };
      }
      return accum;
    }, {});

    return datasets;
  }

  private static createDatas = ({
    date,
    daily_total_fee,
    packages,
  }: {
    date: string;
    daily_total_fee: ValueWithDenomType;
    packages: Array<{
      path: string;
      daily_fee: number;
      percent: number;
    }>;
  }) => {
    return packages.map(item => {
      return {
        date: date ?? '',
        packagePath: `${item.path}`.replace('gno.land', ''),
        packageDailyFee: item.daily_fee ?? 0,
        totalDailyFee: daily_total_fee.value ?? 0,
        percent: item.percent ?? 0,
      };
    });
  };
}
