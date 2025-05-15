import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { DAY_TIME } from "@/common/values/constant-value";
import styled from "styled-components";
import Text from "@/components/ui/text";
import theme from "@/styles/theme";
import { Spinner } from "@/components/ui/loading";
import BigNumber from "bignumber.js";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { useTotalGasInfoApi } from "@/common/hooks/main/use-total-gas-info-api";
import { dateToStr } from "@/common/utils/date-util";
import { useGetTotalGasShare } from "@/common/react-query/statistics";
import { DailyPackages, PackageInfo } from "@/repositories/api/statistics/response";

const AreaChart = dynamic(() => import("@/components/ui/chart").then(mod => mod.AreaChart), {
  ssr: false,
});

export const MainRealmTotalGasShareApi = () => {
  const [period, setPeriod] = useState<7 | 30>(7);
  const { isFetched, transactionRealmGasInfo } = useTotalGasInfoApi(period);

  const { data } = useGetTotalGasShare({ range: period });

  const labels = useMemo(() => {
    const now = new Date();

    return Array.from({ length: period })
      .map((_, index) => new Date(now.getTime() - DAY_TIME * index))
      .sort((d1, d2) => d1.getTime() - d2.getTime())
      .map(dateToStr);
  }, [period]);

  const transactionGasData = useMemo(() => {
    if (!data?.items) return {};

    if (!data.items[0]) return {};

    const allPackages = new Set<string>();
    Object.values(data.items[0]).forEach((dateData: DailyPackages) => {
      Object.keys(dateData).forEach(pkg => {
        allPackages.add(pkg);
      });
    });

    return Array.from(allPackages).reduce<Record<string, Array<{ value: number; rate: number }>>>(
      (accum, packagePath) => {
        const currentLabel = packagePath.replace("gno.land", "");

        accum[currentLabel] = labels.map(date => {
          const dateData = data.items[0][date];
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
            rate: (currentGas / totalGas) * 100,
          };
        });

        return accum;
      },
      {},
    );
  }, [labels, data]);

  const onClickPeriod = (currentPeriod: 7 | 30) => {
    if (period !== currentPeriod) {
      setPeriod(currentPeriod);
    }
  };

  return (
    <Wrapper>
      <div className="title-wrapper">
        <Text className="title" type="h6" color="primary">
          {"Total Fee Share by Realm in GNOT"}
        </Text>
        <div className="period-selector">
          <span className={period === 7 ? "active" : ""} onClick={() => onClickPeriod(7)}>
            7D
          </span>
          <span className={period === 30 ? "active" : ""} onClick={() => onClickPeriod(30)}>
            30D
          </span>
        </div>
      </div>
      {isFetched ? (
        <AreaChart
          labels={labels}
          datas={transactionGasData}
          colors={["#2090F3", "#786AEC", "#FDD15C", "#617BE3", "#30BDD2", "#83CFAA"]}
        />
      ) : (
        <Spinner position="center" />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  & .title-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    .title {
      width: calc(100% - 120px);
      max-height: 40px;
      margin-bottom: 16px;
      word-break: normal;
      line-height: 1em;
    }
  }

  & .period-selector {
    display: flex;
    color: ${({ theme }) => theme.colors.tertiary};

    span {
      width: 60px;
      height: 30px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: 1px solid ${({ theme }) => theme.colors.tertiary};
      ${theme.fonts.p4};
      cursor: pointer;

      &.active {
        cursor: auto;
        background-color: ${({ theme }) => theme.colors.select};
      }

      &:first-child {
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        border-right: none;
      }

      &:last-child {
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        border-left: none;
      }
    }
  }
`;
