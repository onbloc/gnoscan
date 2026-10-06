import React, { useMemo, useState } from "react";
import { RealmSharePeriod, RealmShareChart } from "../realm-share-chart";
import { DAY_TIME } from "@/common/values/constant-value";
import BigNumber from "bignumber.js";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { dateToStr } from "@/common/utils/date-util";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { useGetTotalDailyRealmStorageDeposit } from "@/common/react-query/statistics";
import { StorageDepositInfo } from "@/repositories/api/statistics/response";

export const MainTotalStorageDepositShareApi = () => {
  const [period, setPeriod] = useState<RealmSharePeriod>(7);
  const { data: data, isFetched } = useGetTotalDailyRealmStorageDeposit({ range: period });

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

        const totalStorageDeposit = Object.values(dateData).reduce(
          (sum, storageDeposit: StorageDepositInfo) => sum + storageDeposit.storageDepositAmount,
          0,
        );

        const currentTotalStorageDeposit = dateData[packagePath].storageDepositAmount;

        return {
          value: BigNumber(currentTotalStorageDeposit)
            .shiftedBy(GNOTToken.decimals * -1)
            .toNumber(),
          rate: totalStorageDeposit > 0 ? (currentTotalStorageDeposit / totalStorageDeposit) * 100 : 0,
        };
      });

      return accum;
    }, {});
  }, [labels, data]);

  return (
    <RealmShareChart
      title="Total Storage Deposit Share by Realms"
      period={period}
      onChangePeriod={setPeriod}
      isFetched={isFetched}
      labels={labels}
      datas={transactionGasData}
    />
  );
};
