import {useQuery} from 'react-query';
import {useServiceProvider} from '../provider/use-service-provider';
import {useNetwork} from '../use-network';

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

export const useGetSimpleTransactions = (blockHeight?: number | null) => {
  const {currentNetwork} = useNetwork();
  const {transactionRepository} = useServiceProvider();

  return useQuery<SimpleTransaction[] | null>({
    queryKey: ['useGetSimpleTransactions', currentNetwork?.chainId],
    queryFn: () => {
      if (!transactionRepository || !blockHeight) {
        return null;
      }
      return transactionRepository.getSimpleTransactionsByFromHeight(blockHeight);
    },
    enabled: !!transactionRepository && !!blockHeight,
  });
};
