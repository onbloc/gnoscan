import React from "react";
import Text from "@/components/ui/text";
import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import { useGetSummaryTransactions } from "@/common/react-query/statistics";
import { SummaryTransactionsInfo } from "@/types/data-type";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { DEFAULT_SUMMARY_TRANSACTIONS_INFO } from "@/common/values/default-object/summary";
import { StatisticsQueryState } from "@/components/view/statistics/statistics-query-state";

export const StandardNetworkTxsCard = () => {
  const summaryTransactionsQuery = useGetSummaryTransactions();
  const { data: txsData } = summaryTransactionsQuery;
  const isFetchedTxsData = txsData !== undefined;

  const transactionSummaryInfo: SummaryTransactionsInfo = React.useMemo(() => {
    if (!txsData?.data) return DEFAULT_SUMMARY_TRANSACTIONS_INFO;
    return {
      totalTransactions: String(txsData.data.total),
      transactionFeeAverage: txsData.data.avgFee24h,
      transactionTotalFee: txsData.data.totalFees,
    };
  }, [txsData?.data]);

  return (
    <StatisticsQueryState query={summaryTransactionsQuery}>
      <FetchedComp
        skeletonWidth={130}
        skeletonheight={28}
        skeletonMargin="10px 0px 24px"
        isFetched={isFetchedTxsData}
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
              24h&nbsp;Avg.&nbsp;Fee
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetchedTxsData}
              renderComp={
                <Text type="p4" color="primary">
                  {makeDisplayNumber(transactionSummaryInfo.transactionFeeAverage)}
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
              isFetched={isFetchedTxsData}
              renderComp={
                <Text type="p4" color="primary">
                  {makeDisplayNumber(transactionSummaryInfo.transactionTotalFee)}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </StatisticsQueryState>
  );
};
