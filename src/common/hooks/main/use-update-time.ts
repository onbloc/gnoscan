import {useEffect, useMemo, useState} from 'react';
import {useGetLatestBlock} from '../common/use-get-latest-block';

export const useUpdateTime = () => {
  const {isFetched, latestBlock} = useGetLatestBlock();
  const [currentUpdatedAt, setCurrentUpdatedAt] = useState<string | null>(null);

  const updatedAt = useMemo(() => {
    if (!latestBlock) {
      return null;
    }
    return new Date(latestBlock?.block_meta.header.time);
  }, [latestBlock]);

  useEffect(() => {
    if (updatedAt && !currentUpdatedAt) {
      setCurrentUpdatedAt(updatedAt.toISOString());
    }
  }, [updatedAt, currentUpdatedAt]);

  return {
    isFetched: isFetched || !!currentUpdatedAt,
    updatedAt: currentUpdatedAt,
  };
};
