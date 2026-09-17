import { useGetGRC20Tokens } from "@/common/react-query/realm";
import { stripTokenKeySymbol } from "@/common/utils/token.utility";
import { Amount, TokenInfo } from "@/types/data-type";
import BigNumber from "bignumber.js";
import { useCallback, useMemo } from "react";
import { useTokenResourceMeta } from "./use-token-resource-meta";

export const GNOTToken: TokenInfo = {
  name: "Gno.land",
  denom: "ugnot",
  symbol: "GNOT",
  decimals: 6,
};

export const useTokenMeta = () => {
  const { data: grc20Infos = [], isFetched: isFetchedGRC20Tokens } = useGetGRC20Tokens();
  const { isFetched: isFetchedTokenMeta, getTokenMeta, getTokenImage } = useTokenResourceMeta();

  const tokenMap = useMemo(() => {
    const defaultTokenMap: { [key in string]: TokenInfo } = {
      [GNOTToken.denom]: GNOTToken,
    };
    const grc20TokenMap =
      grc20Infos?.reduce<{ [key in string]: TokenInfo }>((accum, current) => {
        const resolved = getTokenMeta(current.packagePath, {
          name: current.name,
          symbol: current.symbol,
          decimals: current.decimals,
        });
        accum[current.packagePath] = {
          name: resolved.name,
          denom: current.packagePath,
          symbol: resolved.symbol,
          decimals: resolved.decimals,
        };
        return accum;
      }, {}) || {};

    return {
      ...defaultTokenMap,
      ...grc20TokenMap,
    };
  }, [grc20Infos, getTokenMeta]);

  const getTokenInfo = useCallback(
    (tokenId: string): TokenInfo | undefined => {
      const tokenInfo = tokenMap[tokenId] || tokenMap[stripTokenKeySymbol(tokenId)];
      if (!tokenInfo) {
        const values = tokenId.split("/");
        const namespace = values[values.length - 1].toUpperCase();
        return {
          name: namespace,
          denom: namespace,
          symbol: namespace,
          decimals: 6,
        };
      }
      return tokenInfo;
    },
    [tokenMap],
  );

  const getTokenAmount = useCallback(
    (tokenId: string, amountRaw: string | number): Amount => {
      const tokenInfo = tokenMap[tokenId] || tokenMap[stripTokenKeySymbol(tokenId)];
      if (!tokenInfo) {
        const values = tokenId.split("/");
        return {
          value: `${amountRaw}`.toString(),
          denom: values[values.length - 1],
        };
      }
      return {
        value: BigNumber(amountRaw)
          .shiftedBy(tokenInfo.decimals * -1)
          .toString(),
        denom: tokenInfo.symbol,
      };
    },
    [tokenMap],
  );

  return {
    tokenMap,
    isFetchedGRC20Tokens,
    isFetchedTokenMeta,
    getTokenInfo,
    getTokenImage,
    getTokenAmount,
  };
};
