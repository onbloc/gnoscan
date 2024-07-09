import {useGetRealmTotalSupplyQuery} from '@/common/react-query/realm';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import {AmountText} from '@/components/ui/text/amount-text';
import {FontsType} from '@/styles';
import React from 'react';

interface Props {
  realmPath: string;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const LazyTotalSupply = ({realmPath, maxSize = 'p4', minSize = 'body1'}: Props) => {
  const {data: totalSupply, isFetched} = useGetRealmTotalSupplyQuery(realmPath);

  if (!isFetched || totalSupply === undefined) {
    return <SkeletonBar />;
  }

  return <AmountText value={totalSupply} denom={''} maxSize={maxSize} minSize={minSize} />;
};
