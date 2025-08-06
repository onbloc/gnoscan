import { useMemo } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";

import { FontsType, PaletteKeyType } from "@/styles";

import Text from "@/components/ui/text";
import mixins from "@/styles/mixins";
import Tooltip from "@/components/ui/tooltip";
import { convertBytesToKB } from "@/common/utils/format/format-utils";

interface StorageUsageText {
  minSize: FontsType;
  maxSize: FontsType;
  value: number | string | BigNumber;
  denom?: string;
  sizeInBytes?: number;
  decimals?: number;
  color?: PaletteKeyType;
  className?: string;
  bold?: boolean;
  viewSize?: boolean;
}

export const StorageUsageText = ({
  minSize,
  maxSize,
  value,
  denom = "",
  sizeInBytes = 0,
  color = "primary",
  decimals = 6,
  className,
  bold = false,
  viewSize,
}: StorageUsageText) => {
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

  const formattedBytesToKB = useMemo(() => {
    const kb = convertBytesToKB(sizeInBytes);

    if (kb.isZero()) return "0KB";

    return `${kb.toFormat(0)}KB`;
  }, [sizeInBytes]);

  const renderTooltip = () => {
    const formmatedBytes = BigNumber(sizeInBytes.toString()).toFormat(0);
    return (
      <TooltipWrapper>
        {formattedInteger}
        {formattedDecimals}
        {denom}
        &nbsp; ({formmatedBytes} bytes)
      </TooltipWrapper>
    );
  };

  return (
    <Wrapper className={className}>
      <Tooltip content={renderTooltip()}>
        <div className="amount-wrapper">
          <Text
            className="text-wrapper"
            type={maxSize}
            color={color}
            display="contents"
            fontWeight={bold ? 600 : undefined}
          >
            {formattedInteger}
          </Text>
          <Text type={minSize} color={color} display="contents" className="decimals">
            {formattedDecimals}
          </Text>
          <Text type={maxSize} color={color} display="contents">
            {denom}
          </Text>
          {viewSize && (
            <Text type={minSize} color={color} display="contents">
              &nbsp;({formattedBytesToKB})
            </Text>
          )}
        </div>
      </Tooltip>
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

const TooltipWrapper = styled.span`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;
    word-break: keep-all;
    white-space: nowrap;
  }
`;
