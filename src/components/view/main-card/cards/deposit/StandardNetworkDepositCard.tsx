import React from "react";

import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import Text from "@/components/ui/text";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { useGetStoragePrice } from "@/common/react-query/statistics";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { Amount } from "@/types";
import { useGetTotalStorageDeposit } from "@/common/react-query/statistics/use-get-total-storage-deposit";
import { formatBytes } from "@/common/utils/format/format-utils";
import { BYTE_UNITS } from "@/common/values/constant-value";

export const StandardNetworkDepositCard = () => {
  const { data: storagePrice, isFetched: isFetchedStoragePrice } = useGetStoragePrice();
  const { data: totalStorageDeposit, isFetched: isFetchedTotalStorageDeposit } = useGetTotalStorageDeposit();

  const storageDepositDenom = React.useMemo(() => {
    return storagePrice?.denom || "ugnot";
  }, [storagePrice?.denom]);

  const displayStoragePrice: Amount = React.useMemo(() => {
    if (!storagePrice) return { value: "0", denom: storageDepositDenom };

    const converted = toGNOTAmount(storagePrice.value, storageDepositDenom);
    return converted;
  }, [storagePrice, storageDepositDenom]);

  const displayStorageDeposit: Amount = React.useMemo(() => {
    if (!totalStorageDeposit) return { value: "0", denom: storageDepositDenom };

    const converted = toGNOTAmount(totalStorageDeposit.deposit, storageDepositDenom);
    return converted;
  }, [totalStorageDeposit, storageDepositDenom]);

  const formattedBytesData = React.useMemo(() => {
    return formatBytes(totalStorageDeposit?.storage || 0);
  }, [totalStorageDeposit?.storage]);

  return (
    <>
      <FetchedComp
        skeletonWidth={130}
        skeletonheight={28}
        skeletonMargin="10px 0px 24px"
        isFetched={isFetchedTotalStorageDeposit}
        renderComp={
          <Text type="h3" color="primary" margin="10px 0px 24px">
            {makeDisplayNumber(displayStorageDeposit.value)}
            <Text type="p4" display="inline-block" color="primary">
              &nbsp;{displayStorageDeposit.denom}
            </Text>
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Data in Use
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetchedTotalStorageDeposit}
              renderComp={
                <Text type="p4" color="primary">
                  {formattedBytesData.value}
                  <Text type="body1" display="inline-block" color="primary">
                    &nbsp;{formattedBytesData.unit}
                  </Text>
                </Text>
              }
            />
          </dd>
        </BundleDl>
        <hr />
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Storage Price
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isFetchedStoragePrice}
              renderComp={
                <Text type="p4" color="primary">
                  {`${makeDisplayNumber(displayStoragePrice.value)}`}
                  <Text type="body1" display="inline-block" color="primary">
                    &nbsp;{`${displayStoragePrice.denom} / ${BYTE_UNITS.KB.unit}`}
                  </Text>
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
