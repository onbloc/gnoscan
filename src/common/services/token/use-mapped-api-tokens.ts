import React from "react";

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
 * @returns Mapped tokens data and query status
 */
export const useMappedApiTokens = (params?: GetTokensRequestParameters) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  } = useGetTokens(params);

  const [tokens, setTokens] = React.useState<GRC20InfoWithLogo[]>([]);
  const [isDataReady, setIsDataReady] = React.useState(false);

  React.useEffect(() => {
    if (apiData?.pages) {
      setIsDataReady(false);

      const allItems = apiData.pages.flatMap(page => page.items);
      const mappedBlocksData = TokenMapper.fromApiResponses(allItems);

      setTokens(mappedBlocksData);
      setIsDataReady(true);
    } else {
      setTokens([]);
      setIsDataReady(true);
    }
  }, [apiData?.pages]);

  const isLoading = isApiLoading || !isDataReady;
  const isFetched = isApiFetched && isDataReady;

  return {
    data: tokens,
    isFetched,
    isLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  };
};
