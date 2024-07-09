import {useGetHoldersQuery} from '@/common/react-query/realm';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import {AmountText} from '@/components/ui/text/amount-text';
import {FontsType} from '@/styles';
import React from 'react';

interface Props {
  realmPath: string;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const LazyHolders = ({realmPath, maxSize = 'p4', minSize = 'body1'}: Props) => {
  const {data: holders, isFetched} = useGetHoldersQuery(realmPath);

  if (!isFetched || holders === undefined) {
    return <SkeletonBar />;
  }

  return <AmountText value={holders} denom={''} maxSize={maxSize} minSize={minSize} />;
};
