import React from "react";

import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import Text from "@/components/ui/text";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { useGetStoragePrice } from "@/common/react-query/statistics";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { Amount } from "@/types";

export const StandardNetworkDepositCard = () => {
  const { data: storagePrice } = useGetStoragePrice();

  const displayStoragePrice: Amount = React.useMemo(() => {
    if (!storagePrice) return { value: "0", denom: "ugnot" };

    const converted = toGNOTAmount(storagePrice.value, storagePrice.denom);
    return converted;
  }, [storagePrice]);

  return (
    <>
      <FetchedComp
        skeletonWidth={130}
        skeletonheight={28}
        skeletonMargin="10px 0px 24px"
        isFetched={true}
        renderComp={
          <Text type="h3" color="primary" margin="10px 0px 24px">
            {makeDisplayNumber("0")}
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
              Data in Use
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={true}
              renderComp={
                <Text type="p4" color="primary">
                  {makeDisplayNumber("0")}
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
              isFetched={true}
              renderComp={
                <>
                  <Text type="p4" color="primary">
                    {`${makeDisplayNumber(displayStoragePrice.value)} ${displayStoragePrice.denom} / KB`}
                  </Text>
                </>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
