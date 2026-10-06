import React from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import Text from "@/components/ui/text";
import theme from "@/styles/theme";
import { Spinner } from "@/components/ui/loading";

const AreaChart = dynamic(() => import("@/components/ui/chart").then(mod => mod.AreaChart), {
  ssr: false,
});

export type RealmSharePeriod = 7 | 30;

const PERIODS: RealmSharePeriod[] = [7, 30];

const REALM_SHARE_CHART_COLORS = ["#2090F3", "#786AEC", "#FDD15C", "#617BE3", "#30BDD2", "#83CFAA"];

interface RealmShareChartProps {
  title: string;
  period: RealmSharePeriod;
  onChangePeriod: (period: RealmSharePeriod) => void;
  isFetched: boolean;
  labels: string[];
  datas: { [key in string]: Array<{ value: number; rate: number }> };
}

export const RealmShareChart = ({ title, period, onChangePeriod, isFetched, labels, datas }: RealmShareChartProps) => {
  const onClickPeriod = (currentPeriod: RealmSharePeriod) => {
    if (period !== currentPeriod) {
      onChangePeriod(currentPeriod);
    }
  };

  return (
    <Wrapper>
      <div className="title-wrapper">
        <Text className="title" type="h6" color="primary">
          {title}
        </Text>
        <div className="period-selector">
          {PERIODS.map(item => (
            <span key={item} className={period === item ? "active" : ""} onClick={() => onClickPeriod(item)}>
              {`${item}D`}
            </span>
          ))}
        </div>
      </div>
      {isFetched ? (
        <AreaChart labels={labels} datas={datas} colors={REALM_SHARE_CHART_COLORS} />
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
