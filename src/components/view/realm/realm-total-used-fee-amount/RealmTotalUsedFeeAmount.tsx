import React from "react";

import { Amount, Transaction } from "@/types/data-type";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";

import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Badge from "@/components/ui/badge";
import { AmountText } from "@/components/ui/text/amount-text";

interface RealmtotalUsedFeeAmountProps {
  realmTransactions: Transaction[] | undefined;
  isFetched: boolean;
  getTokenAmount: (tokenId: string, amountRaw: string | number) => Amount;
}

export const RealmTotalUsedFeeAmount = ({
  realmTransactions,
  isFetched,
  getTokenAmount,
}: RealmtotalUsedFeeAmountProps) => {
  const totalUsedFee = React.useMemo(() => {
    if (!isFetched) {
      return null;
    }

    if (!realmTransactions) {
      return {
        value: 0,
        denom: GNOTToken.denom,
      };
    }

    const totalUsedFeeAmount = realmTransactions
      .filter(tx => tx.type === "/vm.m_call")
      .map(tx => Number(tx.fee?.value || 0))
      .reduce((accum, current) => accum + current, 0);

    return {
      value: totalUsedFeeAmount,
      denom: GNOTToken.denom,
    };
  }, [realmTransactions]);

  if (!totalUsedFee) {
    return <SkeletonBar />;
  }

  return (
    <Badge>
      <AmountText minSize="body1" maxSize="p4" {...getTokenAmount(totalUsedFee.denom, totalUsedFee.value)} />
    </Badge>
  );
};
