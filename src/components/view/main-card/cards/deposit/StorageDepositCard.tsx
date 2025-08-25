import React from "react";
import { merge } from "lodash";

import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import Text from "@/components/ui/text";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { useGetStoragePrice } from "@/common/react-query/statistics";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { Amount, TotalStorageDeposit } from "@/types";
import { formatBytes } from "@/common/utils/format/format-utils";
import { BYTE_UNITS } from "@/common/values/constant-value";
import { useGetStorageDeposit } from "@/common/react-query/statistics/use-get-storage-deposit";
import { DEFAULT_TOTAL_STORAGE_DEPOSIT_INFO } from "@/common/values/default-object/summary/total-storage-deposit-info";

export const StorageDepositCard = () => {
  const { data: storagePrice, isFetched: isFetchedStoragePrice } = useGetStoragePrice();
  const { data: storageDeposit, isFetched: isFetchedStorageDeposit } = useGetStorageDeposit();

  const totalStorageDepositInfo: TotalStorageDeposit = React.useMemo(() => {
    if (!storageDeposit?.data) return DEFAULT_TOTAL_STORAGE_DEPOSIT_INFO;

    return merge({}, DEFAULT_TOTAL_STORAGE_DEPOSIT_INFO, storageDeposit.data);
  }, [storageDeposit?.data]);

  const storageDepositDenom = React.useMemo(() => {
    return storagePrice?.denom || "ugnot";
  }, [storagePrice?.denom]);

  const displayStoragePrice: Amount = React.useMemo(() => {
    if (!storagePrice) return { value: "0", denom: storageDepositDenom };

    const converted = toGNOTAmount(storagePrice.value, storageDepositDenom);
    return converted;
  }, [storagePrice, storageDepositDenom]);

  const displayStorageDeposit: Amount = React.useMemo(() => {
    const { value = "0", denom = storageDepositDenom } = totalStorageDepositInfo?.storageDepositAmount || {};

    return toGNOTAmount(value, denom);
  }, [totalStorageDepositInfo, storageDepositDenom]);

  const formattedBytesData = React.useMemo(() => {
    return formatBytes(totalStorageDepositInfo?.storageUsage || 0);
  }, [totalStorageDepositInfo?.storageUsage]);

  return (
    <>
      <FetchedComp
        skeletonWidth={130}
        skeletonheight={28}
        skeletonMargin="10px 0px 24px"
        isFetched={isFetchedStorageDeposit}
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
              isFetched={isFetchedStorageDeposit}
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
                    &nbsp;{`${displayStoragePrice.denom} / ${BYTE_UNITS.BYTE.unit}`}
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
