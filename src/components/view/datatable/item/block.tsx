import {numberWithCommas} from '@/common/utils';
import {textEllipsis} from '@/common/utils/string-util';
import Link from 'next/link';
import React from 'react';

interface Props {
  height: string | number | undefined;
}

export const Block = ({height}: Props) => {
  return height ? (
    <Link href={`/blocks/${height}`}>{numberWithCommas(height)}</Link>
  ) : (
    <span>-</span>
  );
};
