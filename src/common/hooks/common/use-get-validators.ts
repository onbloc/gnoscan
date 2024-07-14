import {useGetLatestBlockHeightQuery} from '@/common/react-query/block';
import {useGetValidatorsQuery} from '@/common/react-query/chain';

export const useGetValidators = () => {
  const {data: latestBlockHeight} = useGetLatestBlockHeightQuery();
  const {isFetched, data: validators} = useGetValidatorsQuery(latestBlockHeight || 1);

  return {
    isFetched,
    validators,
  };
};
