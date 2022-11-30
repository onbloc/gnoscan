interface TotalTransactionData {
  date: string;
  transactionCount: number;
}

export class TotalTransactionModel {
  private datas: Array<TotalTransactionData>;

  constructor(
    responseDatas: Array<{
      date?: string;
      num_txs?: number;
    }>,
  ) {
    this.datas = responseDatas.map(TotalTransactionModel.createData);
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
        value: data.transactionCount,
      };
    });
  }

  private static createData = ({
    date,
    num_txs,
  }: {
    date?: string;
    num_txs?: number;
  }): TotalTransactionData => {
    return {
      date: date ?? '',
      transactionCount: num_txs ?? 0,
    };
  };
}
