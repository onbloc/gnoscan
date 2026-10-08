import { CSSProperties } from "react";
import BigNumber from "bignumber.js";

import Text from "@/components/ui/text";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";
import { FontsType, PaletteKeyType } from "@/styles";

interface UsdValueTextProps {
  tokenKey: string;
  // Display units (decimals already applied).
  amount: BigNumber.Value;
  // Defaults to a 4px gap after the preceding amount.
  margin?: CSSProperties["margin"];
  // Defaults match detail summary fields (P4, primary); override to match surrounding text.
  type?: FontsType;
  color?: PaletteKeyType;
  fontWeight?: CSSProperties["fontWeight"];
  style?: CSSProperties;
  className?: string;
}

/** Renders "($12.32)"; renders nothing for a zero amount or when the token has no price. */
export const UsdValueText = ({
  tokenKey,
  amount,
  margin = "0 0 0 4px",
  type = "p4",
  color = "primary",
  fontWeight,
  style,
  className,
}: UsdValueTextProps) => {
  const { getUsdDisplay } = useTokenPrice();
  const usd = BigNumber(amount).isZero() ? null : getUsdDisplay(tokenKey, amount);

  if (!usd) return null;

  return (
    <Text
      type={type}
      color={color}
      fontWeight={fontWeight}
      display="inline"
      margin={margin}
      style={style}
      className={className}
    >
      ({usd})
    </Text>
  );
};
