import {UseInfiniteQueryOptions, UseQueryOptions, useInfiniteQuery, useQuery} from 'react-query';
import {useServiceProvider} from '@/common/hooks/provider/use-service-provider';
import {QUERY_KEY} from './types';
import {Block} from '@/types/data-type';
import {toBech32Address} from '@/common/utils/bech32.utility';
import {BlockResults, NodeResponseBlock} from '@/common/clients/node-client';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';

export const useGetLatestBlockHeightQuery = (options?: UseQueryOptions<number | null, Error>) => {
  const {currentNetwork} = useNetworkProvider();
  const {blockRepository} = useServiceProvider();

  return useQuery<number | null, Error>({
    queryKey: [QUERY_KEY.latestBlockHeight, currentNetwork?.chainId || ''],
    queryFn: () => {
      if (!blockRepository) {
        return null;
      }
      return blockRepository.getLatestBlockHeight().catch(() => null);
    },
    enabled: !!blockRepository,
    ...options,
  });
};

export const useGetLatestBlockHeightIntervalQuery = (
  options?: UseQueryOptions<number | null, Error>,
) => {
  return useGetLatestBlockHeightQuery({...options, refetchInterval: 5_000});
};

export const useGetBlockQuery = (
  blockHeight: number | null,
  options?: UseQueryOptions<NodeResponseBlock | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {blockRepository} = useServiceProvider();

  return useQuery<NodeResponseBlock | null, Error>({
    queryKey: [QUERY_KEY.getBlock, currentNetwork?.chainId || '', blockHeight],
    queryFn: () => {
      if (!blockRepository || !blockHeight) {
        return null;
      }
      return blockRepository.getBlock(blockHeight);
    },
    enabled: !!blockRepository && !!blockHeight,
    keepPreviousData: true,
    ...options,
  });
};

export const useGetBlockTimeQuery = (
  blockHeight: number,
  options?: UseQueryOptions<string | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {blockRepository} = useServiceProvider();

  return useQuery<string | null, Error>({
    queryKey: [QUERY_KEY.getBlockTime, currentNetwork?.chainId || '', blockHeight],
    queryFn: async () => {
      if (!blockRepository) {
        return null;
      }
      return blockRepository.getBlockTime(blockHeight);
    },
    ...options,
  });
};

export const useGetBlocksQuery = (
  latestHeight: number | null | undefined,
  options?: UseInfiniteQueryOptions<Block[] | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {blockRepository} = useServiceProvider();

  return useInfiniteQuery<Block[] | null, Error>({
    queryKey: [QUERY_KEY.getBlocks, currentNetwork?.chainId || '', latestHeight],
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) {
        return false;
      }
      if (lastPage.find(block => block.height === 1)) {
        return false;
      }
      return pages.length + 1;
    },
    queryFn: context => {
      const page = Number(context.pageParam || 1);
      if (!blockRepository || latestHeight === undefined) {
        return null;
      }

      if (latestHeight === null) {
        throw new Error('not supported');
      }

      const maxHeight = latestHeight - (page - 1) * 20;
      const minHeight = maxHeight - 20 > 0 ? maxHeight - 20 : 0;
      return blockRepository.getBlocks(minHeight + 1, maxHeight).then(blockMetas =>
        blockMetas.map(block => {
          const proposerAddress = Array.isArray(block.header.proposer_address)
            ? toBech32Address('g', block.header.proposer_address)
            : block.header.proposer_address;
          return {
            hash: block.block_id.hash,
            height: Number(block.header.height),
            time: new Date(block.header.time).toString(),
            numTxs: Number(block.header.num_txs || 0),
            proposer: proposerAddress,
            proposerRaw: proposerAddress,
            totalFees: null,
          };
        }),
      );
    },
    keepPreviousData: true,
    enabled: !!blockRepository || !!latestHeight,
    ...options,
  });
};

export const useGetBlockResultQuery = (
  height: number,
  options?: UseQueryOptions<BlockResults | null, Error>,
) => {
  const {currentNetwork} = useNetworkProvider();
  const {blockRepository} = useServiceProvider();

  return useQuery<BlockResults | null, Error>({
    queryKey: [QUERY_KEY.getBlockResult, currentNetwork?.chainId || '', height],
    queryFn: () => {
      if (!blockRepository) {
        return null;
      }
      return blockRepository.getBlockResult(height);
    },
    enabled: !!blockRepository && height > 0,
    keepPreviousData: true,
    ...options,
  });
};
