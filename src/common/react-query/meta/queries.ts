import {UseQueryOptions, useQuery} from 'react-query';
import {useServiceProvider} from '@/common/hooks/provider/use-service-provider';
import {QUERY_KEY} from './types';
import {TokenMeta} from '@/types/data-type';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';
import {GNO_TOKEN_RESOURCE_BASE_URI} from '@/common/values/constant-value';

function makeTokenMetaURL(type: 'gno-native' | 'grc20', chainId: string) {
  if (!chainId) {
    return '';
  }
  return `${GNO_TOKEN_RESOURCE_BASE_URI}/${type}/${chainId}.json`;
}

async function fetchTokenMeta(url: string): Promise<TokenMeta[]> {
  if (!url) {
    return [];
  }

  return fetch(url)
    .then(response => response.json())
    .then(json =>
      json?.map(
        (data: any) =>
          ({
            ...data,
            id: data?.denom || data?.pkg_path,
          } || []),
      ),
    )
    .catch(() => []);
}

export const useGetTokenMetaQuery = (options?: UseQueryOptions<TokenMeta[], Error>) => {
  const {currentNetwork} = useNetworkProvider();
  const {blockRepository} = useServiceProvider();

  return useQuery<TokenMeta[], Error>({
    queryKey: [QUERY_KEY.getTokenMeta, currentNetwork.chainId],
    queryFn: () => {
      return Promise.all([
        fetchTokenMeta(makeTokenMetaURL('gno-native', currentNetwork.chainId)),
        fetchTokenMeta(makeTokenMetaURL('grc20', currentNetwork.chainId)),
      ]).then(([nativeTokenResponse, grc20TokenResponse]) => {
        return [...nativeTokenResponse, ...grc20TokenResponse];
      });
    },
    enabled: !!blockRepository,
    ...options,
  });
};
