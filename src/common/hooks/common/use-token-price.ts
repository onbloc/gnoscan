import { useCallback, useMemo } from "react";
import BigNumber from "bignumber.js";

import { useGetPrices } from "@/common/react-query/price";
import { buildTokenPriceMap, formatTokenUsd, getTokenPrice } from "@/common/utils/price.utility";

/**
 * USD prices from the /prices list, fetched once and shared through the query cache.
 * Works for a single token or a list: call the getters per token.
 */
export const useTokenPrice = () => {
  const { data, isFetched } = useGetPrices();

  const priceMap = useMemo(() => buildTokenPriceMap(data?.items), [data]);

  const getPrice = useCallback((tokenKey: string) => getTokenPrice(priceMap, tokenKey), [priceMap]);

  // amount is in display units (decimals already applied), e.g. "512.12" GNOT.
  const getUsdDisplay = useCallback(
    (tokenKey: string, amount: BigNumber.Value) => formatTokenUsd(priceMap, tokenKey, amount),
    [priceMap],
  );

  return { priceMap, isFetched, getPrice, getUsdDisplay };
};
