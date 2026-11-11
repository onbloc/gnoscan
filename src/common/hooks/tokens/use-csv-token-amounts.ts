import BigNumber from "bignumber.js";
import { useCallback, useMemo } from "react";
import { useQueries, useQueryClient } from "react-query";

import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { QUERY_KEY } from "@/common/react-query/query-keys";
import { isUgnot, toGNOTAmount } from "@/common/utils/native-token-utility";
import { stripTokenKeySymbol } from "@/common/utils/token.utility";
import { CACHE_POLICY } from "@/common/values/query.constant";
import { GetTokenMetaByPathResponse } from "@/repositories/api/token/response";
import { Amount } from "@/types/data-type";
import { retryTokenMetaRequest } from "./use-token-meta-amount";

export interface CsvTokenAmounts {
  resolveAmount: (amount: Amount) => Amount;
  isSettled: boolean;
}

export function useCsvTokenAmounts(amounts: Amount[]): CsvTokenAmounts {
  const { currentNetwork } = useNetworkProvider();
  const { apiTokenRepository } = useServiceProvider();
  const { isFetched: isResourceFetched, hasTokenResourceMeta, getTokenMeta } = useTokenResourceMeta();
  const queryClient = useQueryClient();
  const chainId = currentNetwork?.chainId || "";
  const denoms = useMemo(
    () => [...new Set(amounts.map(amount => amount.denom).filter(denom => denom && !isUgnot(denom)))],
    [amounts],
  );
  // Wait for the resource list before deciding which tokens need backend metadata.
  const missingDenoms = useMemo(
    () => (isResourceFetched ? denoms.filter(denom => !hasTokenResourceMeta(denom)) : []),
    [denoms, isResourceFetched, hasTokenResourceMeta],
  );
  const queries = useQueries(
    missingDenoms.map(denom => ({
      queryKey: [chainId, QUERY_KEY.getTokenMetaByPath, denom],
      queryFn: () => apiTokenRepository!.getTokenMetaByPath(denom),
      enabled: !!apiTokenRepository,
      ...CACHE_POLICY.COLD,
      retry: retryTokenMetaRequest,
    })),
  );
  // Keep the resolver stable across unrelated renders, but refresh CSV rows when cached metadata changes.
  const metadataUpdatedAt = queries.map(query => query.dataUpdatedAt).join(",");
  const resolveAmount = useCallback(
    (amount: Amount): Amount => {
      const packagePath = stripTokenKeySymbol(amount.denom);
      const raw = toGNOTAmount(amount.value, packagePath || amount.denom);
      if (isUgnot(amount.denom)) return raw;

      const tokenMeta = metadataUpdatedAt
        ? queryClient.getQueryData<GetTokenMetaByPathResponse>([chainId, QUERY_KEY.getTokenMetaByPath, amount.denom])
            ?.data
        : undefined;
      const backendMeta =
        tokenMeta && tokenMeta.decimals !== undefined
          ? { name: "", symbol: tokenMeta.symbol || amount.denom, decimals: tokenMeta.decimals }
          : undefined;
      const resolved = getTokenMeta(amount.denom, backendMeta || { name: "", symbol: raw.denom, decimals: 0 });
      return {
        value: BigNumber(amount.value).shiftedBy(-resolved.decimals).toFixed(),
        denom: resolved.symbol || raw.denom,
      };
    },
    [chainId, getTokenMeta, queryClient, metadataUpdatedAt],
  );

  return {
    resolveAmount,
    isSettled: denoms.length === 0 || (isResourceFetched && queries.every(query => query.isFetched)),
  };
}
