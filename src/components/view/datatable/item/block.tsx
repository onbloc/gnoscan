import {numberWithCommas} from '@/common/utils';
import React from 'react';

interface Props {
  height: string | number | undefined;
}

export const Block = ({height}: Props) => {
  return height ? (
    <a href={`/blocks/${height}`} target={'_blank'} rel={'noopener noreferrer'}>
      {height}
    </a>
  ) : (
    <span>-</span>
  );
};
