import {useGetRealmTransactionInfoQuery} from '@/common/react-query/realm';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import {AmountText} from '@/components/ui/text/amount-text';
import {FontsType} from '@/styles';
import React, {useMemo} from 'react';

interface Props {
  packagePath: string;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const LazyTotalCalls = ({packagePath, maxSize = 'p4', minSize = 'body1'}: Props) => {
  const {data: transactionInfo, isFetched} = useGetRealmTransactionInfoQuery(packagePath);

  const totalCalls: number | null = useMemo(() => {
    if (!transactionInfo) {
      return null;
    }
    return transactionInfo.msgCallCount;
  }, [transactionInfo]);

  if (!isFetched || totalCalls === null) {
    return <SkeletonBar height={'20px'} />;
  }
  return <AmountText value={totalCalls} denom={''} maxSize={maxSize} minSize={minSize} />;
};
