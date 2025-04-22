import { ValueWithDenomType } from "@/types/data-type";
import BigNumber from "bignumber.js";

interface TotalDailyFeeData {
  date: string;
  fee: number;
}

export class TotalDailyFeeModel {
  private datas: Array<TotalDailyFeeData>;

  constructor(
    responseDatas: Array<{
      date?: string;
      fee?: ValueWithDenomType;
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
        value: data.fee,
      };
    });
  }

  private static createData = ({ date, fee }: { date?: string; fee?: ValueWithDenomType }): TotalDailyFeeData => {
    const gasFee = fee?.value || "0";
    return {
      date: date ?? "",
      fee: new BigNumber(gasFee).toNumber(),
    };
  };
}
