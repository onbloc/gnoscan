import React from "react";
import Text from "@/components/ui/text";
import IconInfo from "@/assets/svgs/icon-info.svg";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip";
import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { useGetSummaryAccounts } from "@/common/react-query/statistics";
import { SummaryAccountsInfo } from "@/types/data-type";
import { DEFAULT_SUMMARY_ACCOUNTS_INFO } from "@/common/values/default-object/summary";

export const StandardNetworkAccountCard = () => {
  const { data, isFetched } = useGetSummaryAccounts();

  const accountSummaryInfo: SummaryAccountsInfo = React.useMemo(() => {
    if (!data?.data) return DEFAULT_SUMMARY_ACCOUNTS_INFO;
    return {
      totalAccounts: data.data.total || 0,
      totalUsers: data.data.users || 0,
      numOfValidators: String(data.data.validators) || "",
    };
  }, [data?.data]);

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
                  {makeDisplayNumber(accountSummaryInfo.numOfValidators)}
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
            <Tooltip content="Number of accounts registered as a user on /r/demo/users.">
              <Button width="16px" height="16px" radius="50%" bgColor="surface">
                <IconInfo className="svg-info" />
              </Button>
            </Tooltip>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {makeDisplayNumber(accountSummaryInfo.totalUsers)}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
