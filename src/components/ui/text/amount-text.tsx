import { useMemo } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { FontsType, PaletteKeyType } from "@/styles";
import mixins from "@/styles/mixins";

interface AmountTextProps {
  minSize: FontsType;
  maxSize: FontsType;
  value: number | string | BigNumber;
  denom?: string;
  decimals?: number;
  color?: PaletteKeyType;
  className?: string;
}

export const AmountText = ({
  minSize,
  maxSize,
  value,
  denom = "",
  color = "primary",
  decimals = 6,
  className,
}: AmountTextProps) => {
  const numberValues = useMemo(() => {
    const valueStr = typeof value === "string" ? value.replace(/,/g, "") : value.toString();
    if (BigNumber(valueStr).isNaN() || valueStr.length === 0) {
      return null;
    }

    const numbers = valueStr.split(".");
    if (numbers.length > 1) {
      return {
        integer: numbers[0],
        decimal: numbers[1] || "0",
      };
    }
    return {
      integer: numbers[0],
      decimal: "0",
    };
  }, [value]);

  const formattedInteger = useMemo(() => {
    if (!numberValues) {
      return "";
    }

    return BigNumber(numberValues.integer).toFormat(0);
  }, [numberValues]);

  const formattedDecimals = useMemo(() => {
    if (!numberValues) {
      return "";
    }

    if (numberValues.decimal === "0") {
      return "";
    }

    return `.${numberValues.decimal.toString().slice(0, decimals)}`;
  }, [decimals, numberValues]);

  return (
    <Wrapper className={className}>
      <div className="amount-wrapper">
        <>
          <Text className="text-wrapper" type={maxSize} color={color} display="contents">
            {formattedInteger}
          </Text>
          <Text type={minSize} color={color} display="contents" className="decimals">
            {formattedDecimals}
          </Text>
          <Text type={maxSize} color={color} display="contents">
            {denom}
          </Text>
        </>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};

  &,
  & * {
    display: inline;
    word-break: break-all;
  }

  .decimals::after {
    content: " ";
  }
`;
