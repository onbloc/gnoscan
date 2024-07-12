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
  const num: string[] | string = decimalPointWithCommas(BigNumber(value === '' ? 0 : value));
  const decimalValue = (num: string[] | string) => {
    if (denom === '' && num[1]) return `.${num[1]}`;
    if (!Array.isArray(num)) {
      return '';
    }

    if (num.length < 2) {
      return '';
    }

    return `.${num[1]}`;
  };

  return (
    <Wrapper className={className}>
      <div className="amount-wrapper">
        {num && (
          <>
            <Text className="text-wrapper" type={maxSize} color={color} display="contents">
              {num[0]}
            </Text>
            <Text type={minSize} color={color} display="contents" className="decimals">
              {decimalValue(num)}
            </Text>
            <Text type={maxSize} color={color} display="contents">
              {denom}
            </Text>
          </>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${mixins.flexbox('row', 'center', 'flex-start')};

  &,
  & * {
    display: inline;
    word-break: break-all;
  }

  .decimals::after {
    content: ' ';
  }
`;
