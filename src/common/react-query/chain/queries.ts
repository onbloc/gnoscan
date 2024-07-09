import {UseQueryOptions, useQuery} from 'react-query';
import {useServiceProvider} from '@/common/hooks/provider/use-service-provider';
import {TokenSupplyInfo} from '@/repositories/chain-repository';
import {QUERY_KEY} from './types';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';

export const useGetTokenSupplyQuery = (
  options?: UseQueryOptions<TokenSupplyInfo | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {chainRepository} = useServiceProvider();

  return useQuery<TokenSupplyInfo | null, Error>({
    queryKey: [QUERY_KEY.getTokenSupply, currentNetwork?.chainId || ''],
    queryFn: () => {
      if (!chainRepository) {
        return null;
      }
      return chainRepository.getTokenSupply();
    },
    enabled: !!chainRepository,
    ...options,
  });
};

export const useGetValidatorsQuery = (
  height: number,
  options?: UseQueryOptions<string[] | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {chainRepository} = useServiceProvider();

  return useQuery<string[] | null, Error>({
    queryKey: [QUERY_KEY.getValidators, currentNetwork?.chainId || ''],
    queryFn: () => {
      if (!chainRepository) {
        return null;
      }
      return chainRepository.getValidators(height);
    },
    enabled: !!chainRepository,
    ...options,
  });
};
