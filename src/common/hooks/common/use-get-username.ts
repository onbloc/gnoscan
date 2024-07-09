import {useQuery} from 'react-query';
import {useServiceProvider} from '../provider/use-service-provider';
import {useNetwork} from '../use-network';
import {useNetworkProvider} from '../provider/use-network-provider';

export const useGetUsername = () => {
  const {indexerQueryClient} = useNetworkProvider();
  const {currentNetwork} = useNetwork();
  const {realmRepository} = useServiceProvider();

  return useQuery<{[key in string]: string}>({
    queryKey: ['useGetUsername', currentNetwork?.chainId],
    queryFn: () => {
      if (!realmRepository) {
        return {};
      }
      return realmRepository.getUsernames();
    },
    enabled: !!realmRepository || !!indexerQueryClient,
  });
};
