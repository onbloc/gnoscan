import {useNetwork} from '@/common/hooks/use-network';
import {numberWithCommas} from '@/common/utils';
import React from 'react';

interface Props {
  height: string | number | undefined;
}

export const Block = ({height}: Props) => {
  const {getUrlWithNetwork} = useNetwork();
  return height ? <a href={getUrlWithNetwork(`/blocks/${height}`)}>{height}</a> : <span>-</span>;
};
