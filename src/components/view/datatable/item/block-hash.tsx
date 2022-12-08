import {textEllipsis} from '@/common/utils/string-util';
import React from 'react';

interface Props {
  hash: string | undefined;
  height: string | number | undefined;
}

export const BlockHash = ({hash, height}: Props) => {
  return height ? (
    <a href={`/blocks/${height}`} target={'_blank'} rel={'noopener noreferrer'}>
      {textEllipsis(hash ?? '', 8)}
    </a>
  ) : (
    <span>-</span>
  );
};
