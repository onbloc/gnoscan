import {UseQueryOptions, useQuery} from 'react-query';
import {useServiceProvider} from '@/common/hooks/provider/use-service-provider';
import {QUERY_KEY} from './types';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';

export const useGetRealmsQuery = (options?: UseQueryOptions<any | null, Error>) => {
  const {currentNetwork} = useNetworkProvider();
  const {realmRepository} = useServiceProvider();

  return useQuery<any | null, Error>({
    queryKey: [QUERY_KEY.getRealms, currentNetwork.chainId],
    queryFn: async () => {
      if (!realmRepository) {
        return null;
      }
      const result = await realmRepository.getRealms();
      if (!result) {
        return null;
      }

      return result.data.transactions.flatMap((tx: any) =>
        tx.messages.map((message: any) => ({
          hash: tx.hash,
          index: tx.index,
          success: tx.success,
          blockHeight: tx.block_height,
          packageName: message.value.package.name,
          packagePath: message.value.package.path,
          creator: message.value.creator,
          functionCount: 0,
          totalCalls: 0,
          totalGasUsed: {
            value: '0',
            denom: 'GNOT',
          },
        })),
      );
    },
    select: data => data.sort((item1: any, item2: any) => item2.blockHeight - item1.blockHeight),
    enabled: !!realmRepository,
    ...options,
  });
};
