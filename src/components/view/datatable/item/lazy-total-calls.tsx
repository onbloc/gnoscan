import {
  useGetRealmTransactionInfosByFromHeightQuery,
  useGetRealmTransactionInfosQuery,
} from "@/common/react-query/realm";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { AmountText } from "@/components/ui/text/amount-text";
import { FontsType } from "@/styles";
import React, { useMemo } from "react";

interface Props {
  packagePath: string;
  isDefault?: boolean;
  defaultFromHeight?: number | null;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const LazyTotalCalls = ({
  packagePath,
  isDefault,
  defaultFromHeight,
  maxSize = "p4",
  minSize = "body1",
}: Props) => {
  const { data: defaultTransactionInfo } = useGetRealmTransactionInfosByFromHeightQuery(defaultFromHeight, {
    enabled: !!isDefault,
  });
  const { data: transactionInfo } = useGetRealmTransactionInfosQuery();

  const totalCalls: number | null = useMemo(() => {
    if (isDefault) {
      if (!defaultTransactionInfo) {
        return null;
      }

      return defaultTransactionInfo?.[packagePath]?.msgCallCount || 0;
    }

    if (!transactionInfo) {
      return null;
    }
    return transactionInfo?.[packagePath]?.msgCallCount || 0;
  }, [packagePath, transactionInfo, isDefault, defaultTransactionInfo]);

  if (totalCalls === null) {
    return <SkeletonBar height={"20px"} />;
  }

  return <AmountText value={totalCalls} denom={""} maxSize={maxSize} minSize={minSize} />;
};
