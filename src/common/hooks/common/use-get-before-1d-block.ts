import { useQuery } from "react-query";
import { useServiceProvider } from "../provider/use-service-provider";
import { useGetLatestBlock } from "./use-get-latest-block";
import { useGetFirstBlock } from "./use-get-first-block";
import { useNetwork } from "../use-network";

const DAY_TIME = 86_400_000 as const; // Day time: 24 * 60 * 60 * 1000

function getBeforeDateTime(date: number) {
  return DAY_TIME * date;
}

/**
 * Predict blocks one month in advance from the average block creation time
 * with indexer lookup performance.
 */
export const useGetBeforeBlockByDate = (date: number) => {
  const { currentNetwork } = useNetwork();
  const { latestBlock } = useGetLatestBlock();
  const { firstBlock } = useGetFirstBlock();
  const { blockRepository } = useServiceProvider();

  return useQuery<number | null>({
    queryKey: ["useGetBeforeBlockByDate", currentNetwork?.chainId, date],
    queryFn: () => {
      if (!firstBlock || !latestBlock) {
        return null;
      }
      const diffTime =
        new Date(latestBlock.block.header.time).getTime() - new Date(firstBlock.block.header.time).getTime();
      const blockAvgTime = diffTime / Number(latestBlock.block.header.height);
      const expectedBlockHeightBefore30d = Math.round(
        Number(latestBlock.block.header.height) - getBeforeDateTime(date) / blockAvgTime,
      );

      return expectedBlockHeightBefore30d > 1 ? expectedBlockHeightBefore30d : 1;
    },
    enabled: !!blockRepository && !!firstBlock && !!latestBlock,
  });
};
