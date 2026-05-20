import { useGetTokenMetaByPath } from "@/common/react-query/token/api/use-get-token-meta-by-path";
import { isUgnot, toGNOTAmount } from "@/common/utils/native-token-utility";
import { makeDisplayTokenAmount } from "@/common/utils/string-util";
import { Amount } from "@/types/data-type";
import React from "react";

export function useTokenMetaAmount(amountInfo?: Amount) {
  const denom = amountInfo?.denom || null;
  // Native denoms (e.g. ugnot) are not served by the token-meta API; skip the
  // request and resolve them via the native-token utility instead.
  const isNativeDenom = !!denom && isUgnot(denom);

  const { data: tokenMeta, isLoading, isFetched } = useGetTokenMetaByPath(isNativeDenom ? "" : denom || "");

  const amount: Amount | null = React.useMemo(() => {
    if (!amountInfo) return null;

    if (!isNativeDenom && tokenMeta?.data && tokenMeta.data.decimals !== undefined) {
      return {
        denom: tokenMeta.data?.symbol || amountInfo.denom,
        value: makeDisplayTokenAmount(amountInfo.value, tokenMeta.data.decimals),
      };
    }

    return toGNOTAmount(amountInfo.value, amountInfo.denom);
  }, [amountInfo, tokenMeta?.data, isNativeDenom]);

  return {
    amount,
    isLoading: isNativeDenom ? false : isLoading,
    isFetched: isNativeDenom ? true : isFetched,
  };
}
