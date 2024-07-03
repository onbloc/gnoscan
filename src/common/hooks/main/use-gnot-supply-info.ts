import {useGetTokenSupplyQuery} from '@/common/react-query/chain';
import {makeDisplayNumber, makeDisplayTokenAmount} from '@/common/utils/string-util';
import {useMemo} from 'react';

export const useGNOTSupply = () => {
  const {data: supplyInfo, isFetched} = useGetTokenSupplyQuery();

  const totalSupplyAmount = useMemo(() => {
    if (!supplyInfo) {
      return '0';
    }
    return makeDisplayTokenAmount(supplyInfo.totalSupplyAmount);
  }, [supplyInfo]);

  const airdropSupplyAmount = useMemo(() => {
    if (!supplyInfo) {
      return '0';
    }
    return makeDisplayTokenAmount(supplyInfo.airdropSupplyAmount);
  }, [supplyInfo]);

  const airdropHolder = useMemo(() => {
    if (!supplyInfo) {
      return '0';
    }
    return makeDisplayNumber(supplyInfo.airdropHolder);
  }, [supplyInfo]);

  return {
    isFetched,
    supplyInfo: {
      totalSupplyAmount,
      airdropSupplyAmount,
      airdropHolder,
    },
  };
};
