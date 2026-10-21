import React, { useMemo, useState } from "react";
import { RealmSharePeriod, RealmShareChart } from "../realm-share-chart";
import { DAY_TIME } from "@/common/values/constant-value";
import { useTotalGasInfo } from "@/common/hooks/main/use-total-gas-info";
import BigNumber from "bignumber.js";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { dateToStr } from "@/common/utils/date-util";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";

export const MainRealmTotalGasShare = () => {
  const [period, setPeriod] = useState<RealmSharePeriod>(7);
  const { isFetched, transactionRealmGasInfo } = useTotalGasInfo();

  const labels = useMemo(() => {
    const now = new Date();

    return Array.from({ length: period })
      .map((_, index) => new Date(now.getTime() - DAY_TIME * index))
      .sort((d1, d2) => d1.getTime() - d2.getTime())
      .map(dateToStr);
  }, [period]);

  const transactionGasData = useMemo(() => {
    if (!transactionRealmGasInfo) {
      return {};
    }
    const dateTotalGas = transactionRealmGasInfo.dateTotalGas;

    /**
     * Generate data by date with key as realmPath.
     */
    return [...transactionRealmGasInfo.displayRealms].reduce<{
      [key in string]: { value: number; rate: number }[];
    }>((accum, current) => {
      const currentLabel = transactionRealmGasInfo.displayRealms.includes(current)
        ? stripGnoLandPrefix(current)
        : "rest";
      accum[currentLabel] = labels.map(date => {
        const totalGas = dateTotalGas[date];
        const dateResult = transactionRealmGasInfo.results.find(result => date === result.date);
        const gasFee = dateResult?.packages.find(pkg => {
          return pkg.path === current;
        })?.gasFee;
        if (!totalGas || gasFee === undefined) {
          return {
            value: 0,
            rate: 0,
          };
        }
        return {
          value: BigNumber(gasFee)
            .shiftedBy(GNOTToken.decimals * -1)
            .toNumber(),
          rate: (gasFee / totalGas) * 100,
        };
      });
      return accum;
    }, {});
  }, [labels, transactionRealmGasInfo]);

  return (
    <RealmShareChart
      title="Total Fee Share by Realm in GNOT"
      period={period}
      onChangePeriod={setPeriod}
      isFetched={isFetched}
      labels={labels}
      datas={transactionGasData}
    />
  );
};
