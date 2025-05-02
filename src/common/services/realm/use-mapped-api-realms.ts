import React from "react";

import { useGetRealms } from "@/common/react-query/realm/api";

import { GetRealmsRequestParameters } from "@/repositories/api/realm/request";
import { Realm } from "@/types/data-type";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";

/**
 * Hooks to map realm data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. useGetRealms to get the original block data from the API.
 * 2. mapping the fetched data into application format using RealmMapper whenever it changes
 * 3. return the mapped data and the correct loading status
 *
 * This hook allows you to use the mapping logic directly in your component without having to handle it yourself
 * you can use data that is already mapped out of the box.
 *
 * @param params - API request parameters
 * @returns Mapped block data and query status
 */
export const useMappedApiRealms = (params?: GetRealmsRequestParameters) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  } = useGetRealms(params);

  const [realms, setRealms] = React.useState<Realm[]>([]);
  const [isDataReady, setIsDataReady] = React.useState(false);

  React.useEffect(() => {
    if (apiData?.pages) {
      setIsDataReady(false);

      const allItems = apiData.pages.flatMap(page => page.items);
      const mappedBlocksData = RealmMapper.fromApiResponses(allItems);

      setRealms(mappedBlocksData);
      setIsDataReady(true);
    } else {
      setRealms([]);
      setIsDataReady(true);
    }
  }, [apiData?.pages]);

  const isLoading = isApiLoading || !isDataReady;
  const isFetched = isApiFetched && isDataReady;

  return {
    data: realms,
    isFetched,
    isLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
  };
};
