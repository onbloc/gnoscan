interface TotalGasShareData {
  date: string;
  packagePath: string;
  packageDailyFee: number;
  totalDailyFee: number;
  percent: number;
}

export class TotalGasShareModel {
  private static FILTERED_LIMIT = 4;

  private static NON_FILTERED_PACAKGE_PATH = 'rest';

  private datas: Array<TotalGasShareData>;

  constructor(
    responseDatas: Array<{
      date?: string;
      pkg_path?: string;
      pkg_daily_fee?: number;
      total_daily_fee?: number;
      pct?: number;
    }>,
  ) {
    this.datas = responseDatas.map(TotalGasShareModel.createData);
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

  private static createData = ({
    date,
    pkg_path,
    pkg_daily_fee,
    total_daily_fee,
    pct,
  }: {
    date?: string;
    pkg_path?: string;
    pkg_daily_fee?: number;
    total_daily_fee?: number;
    pct?: number;
  }) => {
    const packagePath = !pkg_path || pkg_path === '' ? 'None' : pkg_path.replace('gno.land', '');
    return {
      date: date ?? '',
      packagePath: packagePath,
      packageDailyFee: pkg_daily_fee ?? 0,
      totalDailyFee: total_daily_fee ?? 0,
      percent: pct ?? 0,
    };
  };
}
