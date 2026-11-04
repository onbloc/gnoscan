import React from "react";

import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { useGetTokens } from "@/common/react-query/token/api";

import { GetTokensRequestParameters } from "@/repositories/api/token/request";
import { GRC20InfoWithLogo } from "@/common/mapper/token/token-mapper";
import { TokenMapper } from "@/common/mapper/token/token-mapper";

/**
 * Hooks to map token data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. useGetTokens to get the original token data from the API.
 * 2. mapping the fetched data into application format using TokenMapper whenever it changes
 * 3. return the mapped data and the correct loading status
 *
 * This hook allows you to use the mapping logic directly in your component without having to handle it yourself
 * you can use data that is already mapped out of the box.
 *
 * @param params - API request parameters
 * @param options - react-query options
 * @returns Mapped tokens of one page, its paging info and query status
 */
export const useMappedApiTokens = (
  params?: GetTokensRequestParameters,
  options?: Parameters<typeof useGetTokens>[1],
) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    isPreviousData,
  } = useGetTokens(params, options);

  const { getTokenMeta } = useTokenResourceMeta();

  const items = apiData?.items;
  const tokens = React.useMemo<GRC20InfoWithLogo[]>(() => {
    if (!items) {
      return [];
    }

    return TokenMapper.fromApiResponses(items).map(token => {
      const resolved = getTokenMeta(token.tokenId || token.packagePath, {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        image: token.logoUrl,
      });
      return {
        ...token,
        name: resolved.name,
        symbol: resolved.symbol,
        decimals: resolved.decimals,
        logoUrl: resolved.image || "",
      };
    });
  }, [items, getTokenMeta]);

  return {
    data: tokens,
    // Rows of the previous sort stay on screen until the new sort loads.
    isFetched: isApiFetched || isPreviousData,
    isPreviousData,
    isLoading: isApiLoading,
    isError: isApiError,
    hasNext: apiData?.page.hasNext,
    totalCount: apiData?.page.totalCount,
  };
};
