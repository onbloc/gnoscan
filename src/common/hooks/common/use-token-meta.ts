import {useGetTokenMetaQuery} from '@/common/react-query/meta';
import {useGetGRC20Tokens} from '@/common/react-query/realm';
import {GNO_TOKEN_RESOURCE_BASE_URI} from '@/common/values/constant-value';
import {Amount, TokenInfo} from '@/types/data-type';
import BigNumber from 'bignumber.js';
import {useCallback, useMemo} from 'react';

export const GNOTToken: TokenInfo = {
  name: 'Gno.land',
  denom: 'ugnot',
  symbol: 'GNOT',
  decimals: 6,
};

export const useTokenMeta = () => {
  const {data: grc20Infos = [], isFetched: isFetchedGRC20Tokens} = useGetGRC20Tokens();
  const {data: tokenMetas = [], isFetched: isFetchedTokenMeta} = useGetTokenMetaQuery();

  const tokenMap = useMemo(() => {
    const defaultTokenMap: {[key in string]: TokenInfo} = {
      [GNOTToken.denom]: GNOTToken,
    };
    const grc20TokenMap =
      grc20Infos?.reduce<{[key in string]: TokenInfo}>((accum, current) => {
        accum[current.packagePath] = {
          name: current.name,
          denom: current.packagePath,
          symbol: current.symbol,
          decimals: current.decimals,
        };
        return accum;
      }, {}) || {};

    return {
      ...defaultTokenMap,
      ...grc20TokenMap,
    };
  }, [grc20Infos]);

  const tokenImageMap = useMemo(() => {
    return (
      tokenMetas?.reduce<{[key in string]: string}>((accum, current) => {
        accum[current.id] = current.image;
        return accum;
      }, {}) || {}
    );
  }, [tokenMetas]);

  const getTokenInfo = useCallback(
    (tokenId: string): TokenInfo | undefined => {
      const tokenInfo = tokenMap[tokenId];
      if (!tokenInfo) {
        const values = tokenId.split('/');
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
      const tokenInfo = tokenMap[tokenId];
      if (!tokenInfo) {
        const values = tokenId.split('/');
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

  const getTokenImage = useCallback(
    (tokenId: string): string | undefined => {
      if (!tokenImageMap[tokenId]) {
        return undefined;
      }
      return `${GNO_TOKEN_RESOURCE_BASE_URI}${tokenImageMap[tokenId]}`;
    },
    [tokenImageMap],
  );

  return {
    tokenMap,
    tokenImageMap,
    isFetchedGRC20Tokens,
    isFetchedTokenMeta,
    getTokenInfo,
    getTokenImage,
    getTokenAmount,
  };
};
