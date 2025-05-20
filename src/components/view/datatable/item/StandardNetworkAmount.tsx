import { useTokenMetaAmount } from "@/common/hooks/tokens/use-token-meta-amount";
import { FontsType } from "@/styles";
import { Amount } from "@/types/data-type";

import { AmountText } from "@/components/ui/text/amount-text";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";

interface Props {
  data: Amount;
  maxSize?: FontsType;
  minSize?: FontsType;
}

export const StandardNetworkAmount = ({ data, maxSize = "p4", minSize = "body1" }: Props) => {
  const { amount, isLoading } = useTokenMetaAmount(data);

  if (isLoading) {
    return <SkeletonBar width={80} />;
  }

  return (
    <AmountText
      value={amount?.value || "0"}
      denom={amount?.denom || "".toUpperCase()}
      maxSize={maxSize}
      minSize={minSize}
    />
  );
};
