import {useTokenMeta} from '@/common/hooks/common/use-token-meta';
import {useGetRealmTotalSupplyQuery} from '@/common/react-query/realm';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import {AmountText} from '@/components/ui/text/amount-text';
import {FontsType} from '@/styles';
import React, {useMemo} from 'react';

interface Props {
  realmPath: string;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const LazyTotalSupply = ({realmPath, maxSize = 'p4', minSize = 'body1'}: Props) => {
  const {isFetchedGRC20Tokens, getTokenAmount} = useTokenMeta();
  const {data: totalSupply, isFetched} = useGetRealmTotalSupplyQuery(realmPath);

  const displayTotalSupply = useMemo(() => {
    if (!isFetchedGRC20Tokens || totalSupply === undefined) {
      return '-';
    }
    return getTokenAmount(realmPath, totalSupply).value;
  }, [isFetchedGRC20Tokens, totalSupply]);

  if (!isFetched || totalSupply === undefined || !isFetchedGRC20Tokens) {
    return <SkeletonBar />;
  }

  return <AmountText value={displayTotalSupply} denom={''} maxSize={maxSize} minSize={minSize} />;
};
