import {useQuery} from 'react-query';
import {useServiceProvider} from '../provider/use-service-provider';
import {useNetwork} from '../use-network';
import {Transaction} from '@/types/data-type';

export const useMakeTransactionsWithTime = (
  key: string,
  transactions: Transaction[] | null | undefined,
) => {
  const {currentNetwork} = useNetwork();
  const {blockRepository} = useServiceProvider();

  return useQuery<Transaction[]>({
    queryKey: ['useMakeTransactionsWithTime', currentNetwork?.chainId, key || ''],
    queryFn: () =>
      Promise.all(
        transactions?.map(async transaction => {
          const time = await blockRepository?.getBlockTime(transaction.blockHeight);
          return {
            ...transaction,
            time: time || '',
          };
        }) || [],
      ),
    enabled: !!blockRepository && !!transactions,
    keepPreviousData: true,
  });
};
