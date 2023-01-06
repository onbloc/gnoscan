import {ValueWithDenomType} from '@/types/data-type';

interface TotalGasShareData {
  date: string;
  packagePath: string;
  packageDailyFee: number;
  totalDailyFee: number;
  percent: number;
}

export class TotalGasShareModel {
  private static FILTERED_LIMIT = 100;

  private static NON_FILTERED_PACAKGE_PATH = 'rest';

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
      .sort((d1, d2) => d2.dailyFee - d1.dailyFee)
      .map(data => data.packagePath);
  }

  public get chartData() {
    const labels = this.labels;
    const sortedPackagePaths = this.sortedPackagePath;
    const filteredPackagePaths = sortedPackagePaths.slice(
      0,
      sortedPackagePaths.length > TotalGasShareModel.FILTERED_LIMIT
        ? TotalGasShareModel.FILTERED_LIMIT
        : sortedPackagePaths.length,
    );

    const datasets = this.datas.reduce(
      (accum: {[key in string]: Array<{value: number; rate: number}>}, current) => {
        let packagePath = current.packagePath;
        if (!filteredPackagePaths.includes(packagePath)) {
          packagePath = TotalGasShareModel.NON_FILTERED_PACAKGE_PATH;
        }
        if (!accum[packagePath]) {
          accum[packagePath] = new Array(labels.length).fill({
            value: 0,
            rate: 0,
          });
        }

        const dateIndex = labels.findIndex(label => label === current.date);
        if (dateIndex > -1) {
          accum[packagePath][dateIndex] = {
            value: current.packageDailyFee,
            rate: current.percent,
          };
        }
        return accum;
      },
      {},
    );
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
