import React from "react";

import { useGetRealms } from "@/common/react-query/realm/api";

import { GetRealmsRequestParameters } from "@/repositories/api/realm/request";
import { Realm } from "@/types/data-type";
import { RealmMapper } from "@/common/mapper/realm/realm-mapper";

/**
 * Hooks to map realm data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. useGetRealms to get the original realm data from the API.
 * 2. mapping the fetched data into application format using RealmMapper whenever it changes
 * 3. return the mapped data and the correct loading status
 *
 * This hook allows you to use the mapping logic directly in your component without having to handle it yourself
 * you can use data that is already mapped out of the box.
 *
 * @param params - API request parameters
 * @returns Mapped realms data and query status
 */
export const useMappedApiRealms = (params?: GetRealmsRequestParameters) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    fetchNextPage,
    hasNextPage,
    isPreviousData,
  } = useGetRealms(params, { keepPreviousData: true });

  const pages = apiData?.pages;
  const realms = React.useMemo<Realm[]>(
    () => (pages ? RealmMapper.realmListFromApiResponses(pages.flatMap(page => page.items)) : []),
    [pages],
  );

  return {
    data: realms,
    // Rows of the previous sort stay on screen until the new sort loads.
    isFetched: isApiFetched || isPreviousData,
    isPreviousData,
    isLoading: isApiLoading,
    isError: isApiError,
    fetchNextPage,
    // The next cursor of the previous sort does not apply to the new one.
    hasNextPage: hasNextPage && !isPreviousData,
  };
};
