import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { DAY_TIME } from "@/common/values/constant-value";
import styled from "styled-components";
import Text from "@/components/ui/text";
import theme from "@/styles/theme";
import { Spinner } from "@/components/ui/loading";
import { useTotalGasInfo } from "@/common/hooks/main/use-total-gas-info";
import BigNumber from "bignumber.js";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { dateToStr } from "@/common/utils/date-util";

const AreaChart = dynamic(() => import("@/components/ui/chart").then(mod => mod.AreaChart), {
  ssr: false,
});

export const MainRealmTotalGasShare = () => {
  const [period, setPeriod] = useState(7);
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
        ? current.replace("gno.land", "")
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

  const onClickPeriod = (currentPeriod: number) => {
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
