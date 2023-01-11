import {toGnot} from '@/common/utils/gnot-util';
import {AmountText} from '@/components/ui/text/amount-text';
import React from 'react';

interface Props {
  value: number;
  denom: string;
}

export const Amount = ({value, denom}: Props) => {
  return <AmountText value={value} denom={denom.toUpperCase()} maxSize="p4" minSize="body1" />;
};
