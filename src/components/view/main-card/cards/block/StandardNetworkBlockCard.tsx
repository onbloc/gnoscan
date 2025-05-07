import React from "react";
import Text from "@/components/ui/text";
import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import { useGetSummaryBlocks } from "@/common/react-query/statistics";
import { SummaryBlockInfo } from "@/types/data-type";
import { makeDisplayNumber } from "@/common/utils/string-util";

export const StandardNetworkBlockCard = () => {
  const { data, isFetched } = useGetSummaryBlocks();

  const summaryInfo: SummaryBlockInfo = React.useMemo(() => {
    if (!data?.data) return { blockHeight: "", blockTimeAverage: "", txPerBlockAverage: "" };
    return {
      blockHeight: String(data.data.height),
      blockTimeAverage: data.data.avgBlockTime,
      txPerBlockAverage: data.data.avgTxPerBlock,
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
            {makeDisplayNumber(summaryInfo.blockHeight)}
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Avg.&nbsp;Block Time
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {`${summaryInfo.blockTimeAverage} seconds`}
                </Text>
              }
            />
          </dd>
        </BundleDl>
        <hr />
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Avg.&nbsp;Tx per Block
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {summaryInfo.txPerBlockAverage}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
