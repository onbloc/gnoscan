import {FontsType, PaletteKeyType} from '@/styles';
import mixins from '@/styles/mixins';
import React from 'react';
import styled from 'styled-components';
import Text from '@/components/ui/text';
import {decimalPointWithCommas} from '@/common/utils';

interface AmountTextProps {
  minSize: FontsType;
  maxSize: FontsType;
  value: string | number;
  denom?: string;
  color?: PaletteKeyType;
}

export const AmountText = ({
  minSize,
  maxSize,
  value,
  denom,
  color = 'primary',
}: AmountTextProps) => {
  const num: string[] | string = decimalPointWithCommas(value);
  console.log('---------- : ', num);
  return (
    <Wrapper>
      {num && (
        <Text type={maxSize} color={color} display="inline-block">
          {num[0]}
          {Boolean(Number(num[1])) && (
            <Text type={minSize} color={color} display="inline-block">
              {`.${num[1]}`}
            </Text>
          )}
          {denom && (
            <Text type={minSize} color={color} display="inline-block">
              {` ${denom}`}
            </Text>
          )}
        </Text>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${mixins.flexbox('row', 'center', 'flex-start')};
`;
