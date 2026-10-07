import BigNumber from "bignumber.js";

import Text from "@/components/ui/text";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";

interface UsdValueTextProps {
  tokenKey: string;
  // Display units (decimals already applied).
  amount: BigNumber.Value;
  className?: string;
}

/** Renders "($12.32)"; renders nothing when the token has no price. */
export const UsdValueText = ({ tokenKey, amount, className }: UsdValueTextProps) => {
  const { getUsdDisplay } = useTokenPrice();
  const usd = getUsdDisplay(tokenKey, amount);

  if (!usd) return null;

  return (
    <Text type="p4" color="primary" display="inline" className={className}>
      ({usd})
    </Text>
  );
};
