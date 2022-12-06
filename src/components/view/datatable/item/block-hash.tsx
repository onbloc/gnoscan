import {textEllipsis} from '@/common/utils/string-util';
import Link from 'next/link';
import React from 'react';

interface Props {
  hash: string | undefined;
  height: string | number | undefined;
}

export const BlockHash = ({hash, height}: Props) => {
  return height ? (
    <Link href={`/blocks/${height}`}>{textEllipsis(hash ?? '', 8)}</Link>
  ) : (
    <span>-</span>
  );
};
