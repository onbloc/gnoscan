import {useQuery} from 'react-query';
import {useServiceProvider} from '../provider/use-service-provider';
import {useGetLatestBlock} from './use-get-latest-block';
import {useGetFirstBlock} from './use-get-first-block';
import {useNetwork} from '../use-network';

const DAY_TIME = 86_400_000 as const; // Day time: 24 * 60 * 60 * 1000

function getBeforeDateTime(date: number) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return now.getTime() - today.getTime() + DAY_TIME * date;
}

/**
 * Predict blocks one month in advance from the average block creation time
 * with indexer lookup performance.
 */
export const useGetBefore30DBlock = () => {
  const {currentNetwork} = useNetwork();
  const {latestBlock} = useGetLatestBlock();
  const {firstBlock} = useGetFirstBlock();
  const {blockRepository} = useServiceProvider();

  return useQuery<number | null>({
    queryKey: ['useGetBefore30DBlock', currentNetwork?.chainId],
    queryFn: () => {
      if (!firstBlock || !latestBlock) {
        return null;
      }
      const diffTime =
        new Date(latestBlock.block.header.time).getTime() -
        new Date(firstBlock.block.header.time).getTime();
      const blockAvgTime = diffTime / Number(latestBlock.block.header.height);
      const expectedBlockHeightBefore30d = Math.round(
        Number(latestBlock.block.header.height) - getBeforeDateTime(31) / blockAvgTime,
      );

      return expectedBlockHeightBefore30d > 1 ? expectedBlockHeightBefore30d : 1;
    },
    enabled: !!blockRepository && !!firstBlock && !!latestBlock,
  });
};
