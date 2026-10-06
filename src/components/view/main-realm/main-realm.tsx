"use client";

import React from "react";
import styled from "styled-components";
import Card from "@/components/ui/card";
import { MainRealmTotalGasShare } from ".";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { MainRealmTotalGasShareApi } from "./total-gas-share/total-gas-share-api";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { SectionGrid, sectionChartCardStyle } from "@/components/view/common/section-grid/SectionGrid.styles";
import CustomNetworkActiveNewest from "../main-active-list/active-newest/CustomNetworkActiveNewest";
import StandardNetworkActiveNewest from "../main-active-list/active-newest/StandardNetworkActiveNewest";
import { MainTotalStorageDepositShareApi } from "./total-storage-deposit-share/total-storage-deposit-share-api";

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
      {isCustomNetwork ? (
        <CustomNetworkActiveNewest />
      ) : (
        <Card height="368px" className="card-1">
          <>
            <MainTotalStorageDepositShareApi />
          </>
        </Card>
      )}
    </Wrapper>
  );
};

const Wrapper = styled(SectionGrid)`
  ${sectionChartCardStyle}
`;

export default MainRealm;
