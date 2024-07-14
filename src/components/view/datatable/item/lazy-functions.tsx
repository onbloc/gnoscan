import {useGetRealmFunctionsQuery} from '@/common/react-query/realm';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import {AmountText} from '@/components/ui/text/amount-text';
import {FontsType} from '@/styles';
import React from 'react';

interface Props {
  realmPath: string;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const LazyFunctions = ({realmPath, maxSize = 'p4', minSize = 'body1'}: Props) => {
  const {data: functions, isFetched} = useGetRealmFunctionsQuery(realmPath);

  if (!isFetched || functions === undefined) {
    return <SkeletonBar height={'20px'} />;
  }

  return (
    <AmountText value={functions?.length || 0} denom={''} maxSize={maxSize} minSize={minSize} />
  );
};
