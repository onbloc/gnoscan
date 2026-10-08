import React from "react";
import Text from "@/components/ui/text";
import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import { useGetGnotPrice, useGetSummarySupply } from "@/common/react-query/statistics";
import { makeCompactNumber } from "@/common/utils/string-util";

const formatPrice = (price: string) => `$${Number(price).toFixed(4)}`;

const formatPriceChange = (change: number) => `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

export const StandardNetworkSupplyCard = () => {
  const { data: supply, isFetched: isSupplyFetched } = useGetSummarySupply();
  const { data: market, isFetched: isMarketFetched } = useGetGnotPrice();
  // An unpriced asset comes back with an empty price, which must not render as $0.0000.
  const price = market?.data.price || null;
  const priceChange = market?.data.changeRateOneDay;
  const circulatingSupply = market?.data.circulatingSupply;
  const priceChangeColor = priceChange != null && priceChange >= 0 ? "green" : "failed";

  return (
    <>
      <FetchedComp
        skeletonWidth={130}
        skeletonheight={28}
        skeletonMargin="10px 0px 24px"
        isFetched={isMarketFetched}
        renderComp={
          <Text
            type="h3"
            color="primary"
            display="flex"
            margin="10px 0px 24px"
            fontWeight={600}
            style={{ alignItems: "center" }}
          >
            {price != null ? formatPrice(price) : "-"}
            {priceChange != null && (
              <Text
                type="body2"
                color={priceChangeColor}
                margin="0px 0px 0px 6px"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <Text type="body2" display="inline" fontWeight={700} color={priceChangeColor}>
                  {formatPriceChange(priceChange)}
                </Text>{" "}
                (24h)
              </Text>
            )}
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            {/* Circulating supply as self reported to CoinMarketCap. It is not derived from on-chain vesting, so it can lag the amount actually unlocked. */}
            <Text type="p4" color="tertiary">
              Circ.&nbsp;Supply
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isMarketFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {circulatingSupply != null ? `${makeCompactNumber(circulatingSupply)} GNOT` : "-"}
                </Text>
              }
            />
          </dd>
        </BundleDl>
        <hr />
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Max&nbsp;Supply
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={isSupplyFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {supply?.data ? `${makeCompactNumber(supply.data.total)} GNOT` : "-"}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
