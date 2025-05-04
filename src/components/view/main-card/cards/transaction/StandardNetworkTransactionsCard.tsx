import React from "react";
import Text from "@/components/ui/text";
import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import { useTransactionSummaryInfo } from "@/common/hooks/main/use-transaction-summary-info";
import { useGetSummaryTransactions } from "@/common/react-query/statistics";
import { SummaryTransactionsInfo } from "@/types/data-type";

export const StandardNetworkTxsCard = () => {
  const { data, isFetched } = useGetSummaryTransactions();

  const transactionSummaryInfo: SummaryTransactionsInfo = React.useMemo(() => {
    if (!data?.data) return { totalTransactions: "", transactionFeeAverage: "", transactionTotalFee: "" };
    return {
      totalTransactions: String(data.data.total),
      transactionFeeAverage: data.data.avgFee24h,
      transactionTotalFee: data.data.totalFees,
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
            {transactionSummaryInfo.totalTransactions}
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              24h&nbsp;Avg.&nbsp;Fee
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {transactionSummaryInfo.transactionFeeAverage}
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
                  {transactionSummaryInfo.transactionTotalFee}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
