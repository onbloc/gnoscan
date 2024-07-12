import React, {useMemo} from 'react';
import {useTokenMeta} from '@/common/hooks/common/use-token-meta';
import {useGetRealmTransactionInfoQuery} from '@/common/react-query/realm';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import {AmountText} from '@/components/ui/text/amount-text';
import {FontsType} from '@/styles';
import {Amount} from '@/types/data-type';

interface Props {
  packagePath: string;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const LazyFeeAmount = ({packagePath, maxSize = 'p4', minSize = 'body1'}: Props) => {
  const {data: transactionInfo, isFetched} = useGetRealmTransactionInfoQuery(packagePath);
  const {getTokenAmount} = useTokenMeta();

  const amount: Amount | null = useMemo(() => {
    if (!transactionInfo) {
      return null;
    }
    return getTokenAmount('ugnot', transactionInfo.gasUsed);
  }, [transactionInfo]);

  if (!isFetched || !amount) {
    return <SkeletonBar height={'20px'} />;
  }

  return (
    <AmountText
      value={amount.value}
      denom={amount.denom?.toUpperCase()}
      maxSize={maxSize}
      minSize={minSize}
    />
  );
};
