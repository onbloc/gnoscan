"use client";

import Card from "@/components/ui/card";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Text from "@/components/ui/text";
import { InfoTooltip } from "@/components/ui/tooltip/info-tooltip";
import mixins from "@/styles/mixins";
import React from "react";
import styled from "styled-components";
import { media } from "@/common/values/ui.constant";
import { SectionGrid } from "@/components/view/common/section-grid/SectionGrid.styles";
import { CustomNetworkSupplyCard } from "./cards/supply/CustomNetworkSupplyCard";
import { StandardNetworkSupplyCard } from "./cards/supply/StandardNetworkSupplyCard";
import { CustomNetworkBlockCard } from "./cards/block/CustomNetworkBlockCard";
import { StandardNetworkBlockCard } from "./cards/block/StandardNetworkBlockCard";
import { CustomNetworkTxsCard } from "./cards/transaction/CustomNetworkTransactionsCard";
import { StandardNetworkTxsCard } from "./cards/transaction/StandardNetworkTransactionsCard";
import { StorageDepositCard } from "./cards/deposit/StorageDepositCard";
import { CustomNetworkAccountCard } from "./cards/account/CustomNetworkAccountCard";

interface MainCardProps {
  isCustomNetwork: boolean;
}

const MainCard = ({ isCustomNetwork }: MainCardProps) => {
  return (
    <Wrapper>
      <StyledCard>
        <Text type="h5" color="primary" className="title-info">
          GNOT&nbsp;Supply
          <InfoTooltip width={229} content="Total GNOT supply at Genesis." bgColor="base" />
        </Text>
        {isCustomNetwork ? <CustomNetworkSupplyCard /> : <StandardNetworkSupplyCard />}
      </StyledCard>
      <StyledCard>
        <Text type="h5" color="primary">
          Block&nbsp;Height
        </Text>
        {isCustomNetwork ? <CustomNetworkBlockCard /> : <StandardNetworkBlockCard />}
      </StyledCard>
      <StyledCard>
        <Text type="h5" color="primary">
          Total&nbsp;Transactions
        </Text>
        {isCustomNetwork ? <CustomNetworkTxsCard /> : <StandardNetworkTxsCard />}
      </StyledCard>
      <StyledCard>
        {isCustomNetwork ? (
          <>
            <Text type="h5" color="primary" className="title-info">
              Total&nbsp;Accounts
              <InfoTooltip content="Total number of accounts included in at least 1 transaction." bgColor="base" />
            </Text>
            <CustomNetworkAccountCard />
          </>
        ) : (
          <>
            <Text type="h5" color="primary" className="title-info">
              Storage&nbsp;Deposit
              <InfoTooltip content="Total amount of GNOT deposited for storage in real time." bgColor="base" />
            </Text>
            <StorageDepositCard />
          </>
        )}
      </StyledCard>
    </Wrapper>
  );
};

export const FetchedComp = ({
  skeletonWidth,
  skeletonheight = 16,
  skeletonMargin = "",
  isFetched,
  renderComp,
}: {
  skeletonWidth: number;
  skeletonheight?: number;
  skeletonMargin?: string;
  isFetched: boolean;
  renderComp: React.ReactNode;
}) => {
  return (
    <>
      {isFetched ? renderComp : <SkeletonBar width={skeletonWidth} height={skeletonheight} margin={skeletonMargin} />}
    </>
  );
};

export const Wrapper = styled(SectionGrid)`
  ${media.DESKTOP} {
    grid-template-columns: repeat(4, 1fr);
  }
  ${media.TABLET} {
    grid-template-columns: 1fr 1fr;
  }
  .title-info {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 6px;
  }
  .svg-info {
    fill: ${({ theme }) => theme.colors.reverse};
  }
`;

export const DataBoxContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.base};
  border: 1px solid ${({ theme }) => theme.colors.dimmed50};
  border-radius: 10px;
  width: 100%;
  padding: 16px;
  hr {
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.colors.dimmed50};
    margin: 10px 0px;
  }
`;

export const BundleDl = styled.dl`
  ${mixins.flexbox("row", "center", "space-between")};
  dt {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 6px;
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
  min-height: 223px;
`;

export default MainCard;
