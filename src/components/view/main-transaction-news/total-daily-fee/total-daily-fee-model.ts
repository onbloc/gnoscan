interface TotalDailyFeeData {
  date: string;
  gasFee: number;
}

export class TotalDailyFeeModel {
  private datas: Array<TotalDailyFeeData>;

  constructor(
    responseDatas: Array<{
      date?: string;
      gas_fee?: number;
    }>,
  ) {
    this.datas = responseDatas.map(TotalDailyFeeModel.createData);
  }

  private get sortedData() {
    return this.datas.sort((d1, d2) => (d1.date < d2.date ? -1 : d1.date > d2.date ? 1 : 0));
  }

  public get labels() {
    return this.sortedData.map(data => data.date);
  }

  public get chartData() {
    return this.sortedData.map(data => {
      return {
        date: data.date,
        value: data.gasFee,
      };
    });
  }

  private static createData = ({
    date,
    gas_fee,
  }: {
    date?: string;
    gas_fee?: number;
  }): TotalDailyFeeData => {
    return {
      date: date ?? '',
      gasFee: gas_fee ?? 0,
    };
  };
}
