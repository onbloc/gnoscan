import {useQuery} from 'react-query';
import {useServiceProvider} from '../provider/use-service-provider';
import {useGetLatestBlock} from './use-get-latest-block';
import {useGetFirstBlock} from './use-get-first-block';
import {useNetwork} from '../use-network';
import {SimpleTransaction} from './use-get-simple-transactions';

export const useGetSimpleTransactionWithTimes = (
  transactions: SimpleTransaction[] | null | undefined,
) => {
  const {currentNetwork} = useNetwork();
  const {blockRepository} = useServiceProvider();
  const {latestBlock} = useGetLatestBlock();
  const {firstBlock} = useGetFirstBlock();

  return useQuery<SimpleTransaction[] | null>({
    queryKey: [
      'useGetSimpleTransactionWithTimes',
      currentNetwork?.chainId,
      transactions?.length || 0,
    ],
    queryFn: async () => {
      if (!blockRepository || !transactions || !firstBlock || !latestBlock) {
        return null;
      }
      const firstBlockTime = new Date(firstBlock.block.header.time).getTime();
      const diffTime = new Date(latestBlock.block.header.time).getTime() - firstBlockTime;
      const blockAvgTime = diffTime / Number(latestBlock.block.header.height);

      return transactions.map(tx => ({
        ...tx,
        time: new Date(firstBlockTime + blockAvgTime * tx.block_height).toISOString(),
      }));
    },
    enabled: !!blockRepository && !!transactions && !!firstBlock && !!latestBlock,
  });
};
