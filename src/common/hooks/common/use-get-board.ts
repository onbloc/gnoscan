import {useQuery} from 'react-query';
import {useServiceProvider} from '../provider/use-service-provider';
import {useNetwork} from '../use-network';
import {Board} from '@/types/data-type';

export interface SimpleTransaction {
  success: boolean;
  block_height: number;
  messages: {
    value: {
      from_address?: string;
      caller?: string;
      pkg_path?: string;
      func?: string;
      args?: string[] | null;
      creator?: string;
    };
  }[];
  gas_fee: {
    amount: number;
    denom: string;
  };
  time?: string;
  gas_used: number;
  gas_wanted: number;
}

export const useGetBoard = (blockHeight?: number | null) => {
  const {currentNetwork} = useNetwork();
  const {realmRepository} = useServiceProvider();

  return useQuery<Board[]>({
    queryKey: ['useGetBoard', currentNetwork?.chainId, blockHeight || ''],
    queryFn: () => {
      if (!realmRepository) {
        return [];
      }
      return realmRepository.getBoards();
    },
    enabled: !!realmRepository,
  });
};
