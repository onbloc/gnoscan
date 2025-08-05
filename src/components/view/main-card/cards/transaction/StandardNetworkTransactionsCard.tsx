import React from "react";
import Text from "@/components/ui/text";
import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import { useGetSummaryTransactions } from "@/common/react-query/statistics";
import { SummaryTransactionsInfo } from "@/types/data-type";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { DEFAULT_SUMMARY_TRANSACTIONS_INFO } from "@/common/values/default-object/summary";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import IconInfo from "@/assets/svgs/icon-info.svg";

export const StandardNetworkTxsCard = () => {
  const { data, isFetched } = useGetSummaryTransactions();

  const transactionSummaryInfo: SummaryTransactionsInfo = React.useMemo(() => {
    if (!data?.data) return DEFAULT_SUMMARY_TRANSACTIONS_INFO;
    return {
      totalTransactions: String(data.data.total),
      transactionFeeAverage: data.data.avgFee24h,
      transactionTotalFee: data.data.totalFees,
      totalAccounts: "0",
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
            {makeDisplayNumber(transactionSummaryInfo.totalTransactions)}
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Total&nbsp;Accounts
            </Text>
            <Tooltip content="Total number of accounts included in at least 1 transaction.">
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
                  {makeDisplayNumber(transactionSummaryInfo.totalAccounts)}
                </Text>
              }
            />
          </dd>
        </BundleDl>
        <hr />
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Total&nbsp;Fees
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {makeDisplayNumber(transactionSummaryInfo.transactionTotalFee)}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
