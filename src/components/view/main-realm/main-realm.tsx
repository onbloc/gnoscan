"use client";

import React from "react";
import styled from "styled-components";
import Card from "@/components/ui/card";
import { MainRealmTotalGasShare } from ".";
import ActiveNewest from "../main-active-list/active-newest";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { MainRealmTotalGasShareApi } from "./total-gas-share/total-gas-share-api";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

interface MainRealmProps {
  breakpoint: DEVICE_TYPE;
}

const MainRealm = ({ breakpoint }: MainRealmProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return (
    <Wrapper className={breakpoint}>
      <Card height="368px" className="card-1">
        {isCustomNetwork ? <MainRealmTotalGasShare /> : <MainRealmTotalGasShareApi />}
      </Card>
      <ActiveNewest />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;
  &.desktop {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 32px;
  }

  & .title {
    width: 100%;
    margin-bottom: 16px;
  }

  & > div {
    overflow: hidden;
  }
`;

export default MainRealm;
