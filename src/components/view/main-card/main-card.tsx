"use client";

import IconInfo from "@/assets/svgs/icon-info.svg";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import mixins from "@/styles/mixins";
import React from "react";
import styled from "styled-components";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { CustomNetworkSupplyCard } from "./cards/supply/CustomNetworkSupplyCard";
import { StandardNetworkSupplyCard } from "./cards/supply/StandardNetworkSupplyCard";
import { CustomNetworkBlockCard } from "./cards/block/CustomNetworkBlockCard";
import { StandardNetworkBlockCard } from "./cards/block/StandardNetworkBlockCard";
import { CustomNetworkTxsCard } from "./cards/transaction/CustomNetworkTransactionsCard";
import { StandardNetworkTxsCard } from "./cards/transaction/StandardNetworkTransactionsCard";
import { StorageDepositCard } from "./cards/deposit/StorageDepositCard";
import { CustomNetworkAccountCard } from "./cards/account/CustomNetworkAccountCard";

interface MainCardProps {
  breakpoint: DEVICE_TYPE;
  isCustomNetwork: boolean;
}

const MainCard = ({ breakpoint, isCustomNetwork }: MainCardProps) => {
  return (
    <Wrapper className={breakpoint}>
      <StyledCard>
        <Text type="h5" color="primary" className="title-info">
          GNOT&nbsp;Supply
          <Tooltip
            width={229}
            content="This number represents the total supply at Genesis in testnets, which can be subject to change in mainnet."
          >
            <Button width="16px" height="16px" radius="50%" bgColor="base">
              <IconInfo className="svg-info" />
            </Button>
          </Tooltip>
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
              <Tooltip content="Total number of accounts included in at least 1 transaction.">
                <Button width="16px" height="16px" radius="50%" bgColor="base">
                  <IconInfo className="svg-info" />
                </Button>
              </Tooltip>
            </Text>
            <CustomNetworkAccountCard />
          </>
        ) : (
          <>
            <Text type="h5" color="primary" className="title-info">
              Storage&nbsp;Deposit
              <Tooltip content="Total amount of GNOT deposited for storage in real time.">
                <Button width="16px" height="16px" radius="50%" bgColor="base">
                  <IconInfo className="svg-info" />
                </Button>
              </Tooltip>
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

export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 32px;
  grid-template-columns: repeat(4, 1fr);
  &.tablet {
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  }
  &.mobile {
    grid-template-columns: 1fr;
    grid-gap: 16px;
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
