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
 * @returns Mapped realms of one page, its paging info and query status
 */
export const useMappedApiRealms = (params?: Omit<GetRealmsRequestParameters, "limit"> & { limit?: never }) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
    isPreviousData,
  } = useGetRealms(params);

  const items = apiData?.items;
  const realms = React.useMemo<Realm[]>(() => (items ? RealmMapper.realmListFromApiResponses(items) : []), [items]);

  return {
    data: realms,
    // Rows of the previous sort stay on screen until the new sort loads.
    isFetched: isApiFetched || isPreviousData,
    isPreviousData,
    isLoading: isApiLoading,
    isError: isApiError,
    hasNext: apiData?.page.hasNext,
    totalCount: apiData?.page.totalCount,
  };
};
