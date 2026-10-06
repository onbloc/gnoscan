import React, { useMemo, useState } from "react";
import { RealmSharePeriod, RealmShareChart } from "../realm-share-chart";
import { DAY_TIME } from "@/common/values/constant-value";
import BigNumber from "bignumber.js";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { useTotalGasInfoApi } from "@/common/hooks/main/use-total-gas-info-api";
import { dateToStr } from "@/common/utils/date-util";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { useGetTotalGasShare } from "@/common/react-query/statistics";
import { DailyPackages, PackageInfo } from "@/repositories/api/statistics/response";

export const MainRealmTotalGasShareApi = () => {
  const [period, setPeriod] = useState<RealmSharePeriod>(7);
  const { data, isFetched } = useGetTotalGasShare({ range: period });

  const labels = useMemo(() => {
    const now = new Date();

    return Array.from({ length: period })
      .map((_, index) => new Date(now.getTime() - DAY_TIME * index))
      .sort((d1, d2) => d1.getTime() - d2.getTime())
      .map(dateToStr);
  }, [period]);

  const transactionGasData = useMemo(() => {
    if (!data) return {};

    const allPackages = new Set<string>();
    Object.keys(data).forEach(date => {
      const dateData = data[date];
      Object.keys(dateData).forEach(pkg => {
        allPackages.add(pkg);
      });
    });

    const sortedPackages = Array.from(allPackages).sort((a, b) => {
      if (a === "rest") return 1;
      if (b === "rest") return -1;
      return a.localeCompare(b);
    });

    return sortedPackages.reduce<Record<string, Array<{ value: number; rate: number }>>>((accum, packagePath) => {
      const currentLabel = packagePath === "rest" ? "rest" : stripGnoLandPrefix(packagePath);

      accum[currentLabel] = labels.map(date => {
        const dateData = data[date];
        if (!dateData || !dateData[packagePath]) {
          return {
            value: 0,
            rate: 0,
          };
        }

        const totalGas = Object.values(dateData).reduce((sum, pkg: PackageInfo) => sum + pkg.gasShared, 0);

        const currentGas = dateData[packagePath].gasShared;

        return {
          value: BigNumber(currentGas)
            .shiftedBy(GNOTToken.decimals * -1)
            .toNumber(),
          rate: totalGas > 0 ? (currentGas / totalGas) * 100 : 0,
        };
      });

      return accum;
    }, {});
  }, [labels, data]);

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
