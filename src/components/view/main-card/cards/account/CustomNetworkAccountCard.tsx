import React from "react";
import Text from "@/components/ui/text";
import { InfoTooltip } from "@/components/ui/tooltip/info-tooltip";
import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import { useAccountSummaryInfo } from "@/common/hooks/main/use-account-summary-info";
import { makeDisplayNumber } from "@/common/utils/string-util";

export const CustomNetworkAccountCard = () => {
  const { isFetched, accountSummaryInfo } = useAccountSummaryInfo();

  return (
    <>
      <FetchedComp
        skeletonWidth={130}
        skeletonheight={28}
        skeletonMargin="10px 0px 24px"
        isFetched={isFetched}
        renderComp={
          <Text type="h3" color="primary" margin="10px 0px 24px">
            {makeDisplayNumber(accountSummaryInfo.totalAccounts || 0)}
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Validators
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {accountSummaryInfo.numOfValidators}
                </Text>
              }
            />
          </dd>
        </BundleDl>
        <hr />
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Total&nbsp;Users
            </Text>
            <InfoTooltip content="Number of accounts registered as a user on /r/demo/users." />
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {accountSummaryInfo.totalUsers}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
