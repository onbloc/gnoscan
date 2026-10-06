import React from "react";
import Text from "@/components/ui/text";
import { BundleDl, DataBoxContainer, FetchedComp } from "../../main-card";
import { useGetGnotMarket, useGetSummarySupply } from "@/common/react-query/statistics";
import { makeCompactNumber } from "@/common/utils/string-util";

const formatPrice = (price: number) => `$${price.toFixed(4)}`;

const formatPriceChange = (change: number) => `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

export const StandardNetworkSupplyCard = () => {
  const { data: supply, isFetched: isSupplyFetched } = useGetSummarySupply();
  const { data: market, isFetched: isMarketFetched } = useGetGnotMarket();
  const price = market?.current_price;
  const priceChange = market?.price_change_percentage_24h;
  const circulatingSupply = market?.circulating_supply;

  return (
    <>
      <FetchedComp
        skeletonWidth={130}
        skeletonheight={28}
        skeletonMargin="10px 0px 24px"
        isFetched={isMarketFetched}
        renderComp={
          <Text type="h3" color="primary" margin="10px 0px 24px">
            {price != null ? formatPrice(price) : "-"}
            {priceChange != null && (
              <Text
                type="body2"
                display="inline-block"
                color={priceChange >= 0 ? "green" : "failed"}
                margin="0px 0px 0px 6px"
              >
                <b>{formatPriceChange(priceChange)}</b> (24h)
              </Text>
            )}
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            {/* GNOT circulating in the market, as reported by CoinGecko. Unlike Max Supply, it excludes locked or unreleased tokens. */}
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
