import React, { useMemo } from "react";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import {
  useGetRealmTransactionInfosByFromHeightQuery,
  useGetRealmTransactionInfosQuery,
} from "@/common/react-query/realm";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";
import { AmountText } from "@/components/ui/text/amount-text";
import { FontsType } from "@/styles";
import { Amount } from "@/types/data-type";

interface Props {
  packagePath: string;
  isDefault?: boolean;
  defaultFromHeight?: number | null;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const LazyFeeAmount = ({
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
  const { getTokenAmount } = useTokenMeta();

  const amount: Amount | null = useMemo(() => {
    if (isDefault) {
      if (!defaultTransactionInfo) {
        return null;
      }

      return getTokenAmount("ugnot", defaultTransactionInfo?.[packagePath]?.gasUsed || 0);
    }

    if (!transactionInfo) {
      return null;
    }
    return getTokenAmount("ugnot", transactionInfo?.[packagePath]?.gasUsed || 0);
  }, [getTokenAmount, isDefault, packagePath, transactionInfo, defaultTransactionInfo]);

  if (!amount) {
    return <SkeletonBar height={"20px"} />;
  }

  return <AmountText value={amount.value} denom={amount.denom?.toUpperCase()} maxSize={maxSize} minSize={minSize} />;
};
