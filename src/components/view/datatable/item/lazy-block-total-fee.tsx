import React, {useMemo} from 'react';
import {GNOTToken, useTokenMeta} from '@/common/hooks/common/use-token-meta';
import {useGetRealmTransactionInfosQuery} from '@/common/react-query/realm';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import {AmountText} from '@/components/ui/text/amount-text';
import {FontsType} from '@/styles';
import {Amount} from '@/types/data-type';
import {useGetBlockQuery} from '@/common/react-query/block';
import {decodeTransaction} from '@/common/utils/transaction.utility';
import {parseTokenAmount} from '@/common/utils/token.utility';
import BigNumber from 'bignumber.js';

interface Props {
  blockHeight: number;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const LazyBlockTotalFee = ({blockHeight, maxSize = 'p4', minSize = 'body1'}: Props) => {
  const {data: block, isFetched} = useGetBlockQuery(blockHeight);

  const totalFee = useMemo(() => {
    if (!isFetched || !block) {
      return null;
    }

    const txs = block.block.data.txs?.map(decodeTransaction);
    return txs?.reduce((result, tx) => {
      const fee = tx.fee?.gasFee ? parseTokenAmount(tx.fee.gasFee) : 0;
      return result + fee;
    }, 0);
  }, [block, isFetched]);

  const amount: Amount | null = useMemo(() => {
    if (!totalFee) {
      return null;
    }

    return {
      value: BigNumber(totalFee)
        .shiftedBy(GNOTToken.decimals * -1)
        .toString(),
      denom: GNOTToken.symbol,
    };
  }, [totalFee]);

  if (!isFetched || !amount) {
    return <SkeletonBar height={'20px'} />;
  }

  return (
    <AmountText value={amount.value} denom={amount.denom} maxSize={maxSize} minSize={minSize} />
  );
};
