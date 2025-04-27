import React from "react";
import BigNumber from "bignumber.js";

import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import Badge from "@/components/ui/badge";
import { Transaction } from "@/types/data-type";

interface RealmTotalContractCallsProps {
  realmTransactions: Transaction[] | undefined;
  isFetched: boolean;
}

export const RealmTotalContractCalls = ({ realmTransactions, isFetched }: RealmTotalContractCallsProps) => {
  const totalContractCalls = React.useMemo(() => {
    if (!realmTransactions || !isFetched) {
      return null;
    }

    if (!realmTransactions) {
      return "0";
    }

    const totalCount = realmTransactions.filter(tx => tx.type === "/vm.m_call").length;

    return BigNumber(totalCount).toFormat();
  }, [realmTransactions]);

  if (!totalContractCalls) {
    return <SkeletonBar />;
  }

  return <Badge>{totalContractCalls}</Badge>;
};
