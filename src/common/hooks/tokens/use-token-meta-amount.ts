import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { useGetTokenMetaByPath } from "@/common/react-query/token/api/use-get-token-meta-by-path";
import { isUgnot, toGNOTAmount } from "@/common/utils/native-token-utility";
import { makeDisplayTokenAmount } from "@/common/utils/string-util";
import { stripTokenKeySymbol, toBarePackagePath } from "@/common/utils/token.utility";
import { Amount } from "@/types/data-type";
import React from "react";

export function useTokenMetaAmount(amountInfo?: Amount) {
  const denom = amountInfo?.denom || null;
  // Native denoms (e.g. ugnot) are not served by the token-meta API; skip the
  // request and resolve them via the native-token utility instead.
  const isNativeDenom = !!denom && isUgnot(denom);
  const packagePath = denom ? stripTokenKeySymbol(denom) : denom;

  const { tokenResourceMap, getTokenMeta } = useTokenResourceMeta();
  const hasResourceMeta = !isNativeDenom && !!denom && !!tokenResourceMap[toBarePackagePath(denom)];
  // The static resource list is the first-choice source; only hit the token-meta API
  // for tokens it doesn't cover.
  const skipTokenMetaFetch = isNativeDenom || hasResourceMeta;

  const { data: tokenMeta, isLoading, isFetched } = useGetTokenMetaByPath(skipTokenMetaFetch ? "" : packagePath || "");

  const amount: Amount | null = React.useMemo(() => {
    if (!amountInfo) return null;
    if (isNativeDenom) return toGNOTAmount(amountInfo.value, packagePath || amountInfo.denom);

    const backendMeta =
      tokenMeta?.data && tokenMeta.data.decimals !== undefined
        ? { name: "", symbol: tokenMeta.data.symbol || amountInfo.denom, decimals: tokenMeta.data.decimals }
        : undefined;

    if (denom && (hasResourceMeta || backendMeta)) {
      const resolved = getTokenMeta(denom, backendMeta || { name: "", symbol: amountInfo.denom, decimals: 0 });
      return {
        denom: resolved.symbol || amountInfo.denom,
        value: makeDisplayTokenAmount(amountInfo.value, resolved.decimals),
      };
    }

    return toGNOTAmount(amountInfo.value, packagePath || amountInfo.denom);
  }, [amountInfo, denom, hasResourceMeta, tokenMeta?.data, isNativeDenom, packagePath, getTokenMeta]);

  return {
    amount,
    isLoading: skipTokenMetaFetch ? false : isLoading,
    isFetched: skipTokenMetaFetch ? true : isFetched,
  };
}
