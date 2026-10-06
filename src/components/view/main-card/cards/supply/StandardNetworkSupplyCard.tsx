import React from "react";
import Text from "@/components/ui/text";
import { InfoTooltip } from "@/components/ui/tooltip/info-tooltip";
import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import { useGetSummarySupply } from "@/common/react-query/statistics";
import { SummaryGnotSupplyInfo } from "@/types/data-type";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { DEFAULT_SUMMARY_GNOT_SUPPLY_INFO } from "@/common/values/default-object/summary";

export const StandardNetworkSupplyCard = () => {
  const { data, isFetched } = useGetSummarySupply();

  const supplyInfo: SummaryGnotSupplyInfo = React.useMemo(() => {
    if (!data?.data) return DEFAULT_SUMMARY_GNOT_SUPPLY_INFO;
    return {
      airdropHolder: String(data.data.airdropHolders),
      airdropSupplyAmount: data.data.airdropSupply,
      totalSupplyAmount: data.data.total,
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
            {makeDisplayNumber(supplyInfo.totalSupplyAmount)}
            <Text type="p4" display="inline-block" color="primary">
              &nbsp;GNOT
            </Text>
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Airdrop Supply
            </Text>
            <InfoTooltip width={215} content="Total GNOTs to be airdropped to Cosmos and AtomOne holders." />
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {makeDisplayNumber(supplyInfo.airdropSupplyAmount)}
                </Text>
              }
            />
          </dd>
        </BundleDl>
        <hr />
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Airdrop&nbsp;Holders
            </Text>
            <InfoTooltip content="Total number of holders receiving 1 GNOT or more." />
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {makeDisplayNumber(supplyInfo.airdropHolder)}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
