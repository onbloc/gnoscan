import {toGnot} from '@/common/utils/gnot-util';
import {AmountText} from '@/components/ui/text/amount-text';
import React from 'react';

interface Props {
  value: number;
  denom: string;
}

export const Amount = ({value, denom}: Props) => {
  const amount = toGnot(value, denom);

  return (
    <AmountText
      value={amount.value}
      denom={amount.denom.toUpperCase()}
      maxSize="p4"
      minSize="body1"
    />
  );
};
