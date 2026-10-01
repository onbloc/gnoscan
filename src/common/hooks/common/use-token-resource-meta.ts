import { useCallback, useMemo } from "react";
import { useGetTokenMetaQuery } from "@/common/react-query/meta";
import { GNO_TOKEN_RESOURCE_BASE_URI } from "@/common/values/constant-value";
import {
  ResolvedTokenMeta,
  TokenMetaFallback,
  TokenResourceEntry,
  findByTokenKey,
  resolveTokenMeta,
} from "@/common/utils/token.utility";

/**
 * The static gno-token-resource list, keyed by packagePath (or native denom) and token path - the
 * single place every token-info lookup in the app should check first, falling back to
 * the caller's own backend/on-chain data only for tokens this list doesn't cover.
 */
export const useTokenResourceMeta = () => {
  const { data: tokenMetas = [], isFetched } = useGetTokenMetaQuery();

  const tokenResourceMap = useMemo(() => {
    return tokenMetas.reduce<Record<string, TokenResourceEntry>>((accum, current) => {
      const entry: TokenResourceEntry = {
        name: current.name,
        symbol: current.symbol,
        decimals: current.decimals,
        image: current.image ? `${GNO_TOKEN_RESOURCE_BASE_URI}${current.image}` : undefined,
        tokenPath: current.token_path,
      };
      accum[current.id] = entry;
      if (current.token_path) {
        accum[current.token_path] = entry;
      }
      return accum;
    }, {});
  }, [tokenMetas]);

  const getTokenMeta = useCallback(
    (tokenKey: string, fallback: TokenMetaFallback): ResolvedTokenMeta => {
      return resolveTokenMeta(tokenResourceMap, tokenKey, fallback);
    },
    [tokenResourceMap],
  );

  const hasTokenResourceMeta = useCallback(
    (tokenKey: string): boolean => {
      return !!findByTokenKey(tokenResourceMap, tokenKey);
    },
    [tokenResourceMap],
  );

  const getTokenImage = useCallback(
    (tokenKey: string): string | undefined => {
      return findByTokenKey(tokenResourceMap, tokenKey)?.image;
    },
    [tokenResourceMap],
  );

  return { isFetched, tokenResourceMap, getTokenMeta, hasTokenResourceMeta, getTokenImage };
};
