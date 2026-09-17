import { useCallback, useMemo } from "react";
import { useGetTokenMetaQuery } from "@/common/react-query/meta";
import { GNO_TOKEN_RESOURCE_BASE_URI } from "@/common/values/constant-value";
import { ResolvedTokenMeta, TokenMetaFallback, resolveTokenMeta } from "@/common/utils/token.utility";

/**
 * The static gno-token-resource list, keyed by packagePath (or native denom) - the
 * single place every token-info lookup in the app should check first, falling back to
 * the caller's own backend/on-chain data only for tokens this list doesn't cover.
 */
export const useTokenResourceMeta = () => {
  const { data: tokenMetas = [], isFetched } = useGetTokenMetaQuery();

  const tokenResourceMap = useMemo(() => {
    return tokenMetas.reduce<Record<string, ResolvedTokenMeta>>((accum, current) => {
      accum[current.id] = {
        name: current.name,
        symbol: current.symbol,
        decimals: current.decimals,
        image: current.image ? `${GNO_TOKEN_RESOURCE_BASE_URI}${current.image}` : undefined,
      };
      return accum;
    }, {});
  }, [tokenMetas]);

  const getTokenMeta = useCallback(
    (tokenKey: string, fallback: TokenMetaFallback): ResolvedTokenMeta => {
      return resolveTokenMeta(tokenResourceMap, tokenKey, fallback);
    },
    [tokenResourceMap],
  );

  const getTokenImage = useCallback(
    (tokenKey: string): string | undefined => {
      return tokenResourceMap[tokenKey]?.image;
    },
    [tokenResourceMap],
  );

  return { isFetched, tokenResourceMap, getTokenMeta, getTokenImage };
};
