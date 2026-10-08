import { useCallback } from "react";
import BigNumber from "bignumber.js";

import { useGetPrices } from "@/common/react-query/price";
import { formatTokenUsd, TokenPriceMap } from "@/common/utils/price.utility";

const EMPTY_PRICE_MAP: TokenPriceMap = {};

/** USD values from the shared /prices query. */
export const useTokenPrice = () => {
  // isLoading: first fetch in flight. Stays false when the query is disabled (no API client) or failed.
  const { data: priceMap = EMPTY_PRICE_MAP, isLoading } = useGetPrices();

  // amount is in display units (decimals already applied), e.g. "512.12" GNOT.
  const getUsdDisplay = useCallback(
    (tokenKey: string, amount: BigNumber.Value) => formatTokenUsd(priceMap, tokenKey, amount),
    [priceMap],
  );

  return { isLoading, getUsdDisplay };
};
