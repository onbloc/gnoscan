import {useNetwork} from '@/common/hooks/use-network';
import {textEllipsis} from '@/common/utils/string-util';
import React from 'react';

interface Props {
  hash: string | undefined;
  height: string | number | undefined;
}

export const BlockHash = ({hash, height}: Props) => {
  const {getUrlWithNetwork} = useNetwork();
  return height ? (
    <a href={getUrlWithNetwork(`/blocks/${height}`)}>{textEllipsis(hash ?? '', 8)}</a>
  ) : (
    <span>-</span>
  );
};
