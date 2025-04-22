/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useGetGRC20Tokens } from "@/common/react-query/realm";
import { GRC20_FUNCTIONS } from "@/common/utils/realm.utility";
import { GRC20Info } from "@/repositories/realm-repository.ts";

export const useTokens = () => {
  const { data, isFetched } = useGetGRC20Tokens();
  const [currentPage, setCurrentPage] = useState(0);

  const hasNextPage = useMemo(() => {
    if (!data) {
      return false;
    }

    return data.length > (currentPage + 1) * 20;
  }, [currentPage, data?.length]);

  const tokens = useMemo(() => {
    if (!data) {
      return [];
    }

    const nextIndex = (currentPage + 1) * 20;
    const endIndex = data.length > nextIndex ? nextIndex : data.length;
    return data
      .filter((_: any, index: number) => index < endIndex)
      .map((token: GRC20Info) => ({
        ...token,
        functions: GRC20_FUNCTIONS,
        totalSupply: 0,
        holders: 0,
      }));
  }, [data, currentPage]);

  function nextPage() {
    setCurrentPage(prev => prev + 1);
  }

  return {
    tokens,
    isFetched,
    nextPage,
    hasNextPage,
  };
};
