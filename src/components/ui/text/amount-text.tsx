import {FontsType, PaletteKeyType} from '@/styles';
import mixins from '@/styles/mixins';
import React from 'react';
import styled from 'styled-components';
import Text from '@/components/ui/text';
import {decimalPointWithCommas} from '@/common/utils';
import BigNumber from 'bignumber.js';

interface AmountTextProps {
  minSize: FontsType;
  maxSize: FontsType;
  value: number | string | BigNumber;
  denom?: string;
  color?: PaletteKeyType;
  className?: string;
}

export const AmountText = ({
  minSize,
  maxSize,
  value,
  denom = '',
  color = 'primary',
  className,
}: AmountTextProps) => {
  const num: string[] | string = decimalPointWithCommas(BigNumber(value));
  const decimalValue = (num: string[] | string) => {
    if (!Array.isArray(num)) {
      return ` ${denom}`;
    }

    if (num.length < 2) {
      return ` ${denom}`;
    }

    return `.${num[1]} ${denom}`;
  };

  return (
    <Wrapper className={className}>
      {num && (
        <Text className="text-wrapper" type={maxSize} color={color} display="inline-block">
          {num[0]}
          <Text type={minSize} color={color} display="inline-block">
            {decimalValue(num)}
          </Text>
        </Text>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${mixins.flexbox('row', 'center', 'flex-start')};

  .text-wrapper {
    white-space: nowrap;
  }
`;
