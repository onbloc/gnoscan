"use client";

import React from "react";
import styled from "styled-components";
import Card from "@/components/ui/card";
import Text from "@/components/ui/text";
import { MainTotalTransaction } from ".";
import { MainTotalDailyFee } from ".";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { MainTotalTransactionApi } from "./total-transaction/total-transaction-api";
import { MainTotalDailyFeeApi } from "./total-daily-fee/total-daily-fee-api";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { StackedBarChart2 } from "@/components/ui/chart/stacked-bar-chart/stacked-bar-chart2";

interface MainTransactionNewsProps {
  breakpoint: DEVICE_TYPE;
}

const MainTransactionNews = ({ breakpoint }: MainTransactionNewsProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return (
    <Wrapper className={breakpoint}>
      <Card height="274px" className="card-1">
        <Text className="title" type="h6" color="primary">
          {"Total Storage Deposit"}
        </Text>
        <StackedBarChart2 />
      </Card>

      <Card height="274px" className="card-2">
        <Text className="title" type="h6" color="primary">
          {"Daily Total Transactions"}
        </Text>
        {isCustomNetwork ? <MainTotalTransaction /> : <MainTotalTransactionApi />}
      </Card>

      <Card height="274px" className="card-3">
        <Text className="title" type="h6" color="primary">
          {"Daily Total Fees in GNOT"}
        </Text>
        {isCustomNetwork ? <MainTotalDailyFee /> : <MainTotalDailyFeeApi />}
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;

  & .title {
    width: 100%;
    margin-bottom: 16px;
  }

  &.desktop {
    grid-template-columns: 1fr;
    grid-gap: 32px;
    .card-1 {
      grid-column: 1;
      grid-row: 1;
    }

    .card-2 {
      grid-column: 1;
      grid-row: 2;
    }

    .card-3 {
      grid-column: 1;
      grid-row: 3;
    }
  }

  &.tablet {
    grid-template-columns: 1fr;
  }
  &.mobile {
    grid-template-columns: 1fr;
  }

  & > div {
    overflow: hidden;
  }
`;

export default MainTransactionNews;
