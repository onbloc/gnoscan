import React from "react";
import { useGetTokenMetaByPath } from "@/common/react-query/token/api/use-get-token-meta-by-path";
import { Amount } from "@/types/data-type";
import { makeDisplayTokenAmount } from "@/common/utils/string-util";
import { toGNOTAmount } from "@/common/utils/native-token-utility";

export function useTokenMetaAmount(amountInfo?: Amount) {
  const denom = amountInfo?.denom || null;

  const { data: tokenMeta, isLoading, isFetched } = useGetTokenMetaByPath(denom || "");

  const amount: Amount | null = React.useMemo(() => {
    if (!amountInfo) return null;

    if (tokenMeta?.data && tokenMeta.data.decimals !== undefined) {
      return {
        denom: tokenMeta.data?.symbol || amountInfo.denom,
        value: makeDisplayTokenAmount(amountInfo.value, tokenMeta.data.decimals),
      };
    }

    return toGNOTAmount(amountInfo.value, amountInfo.denom);
  }, [amountInfo, tokenMeta?.data]);

  return { amount, isLoading, isFetched };
}
