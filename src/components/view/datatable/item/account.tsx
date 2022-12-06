import {textEllipsis} from '@/common/utils/string-util';
import Link from 'next/link';
import React from 'react';

interface Props {
  address: string | undefined;
}

export const Account = ({address}: Props) => {
  return <Link href={`/accounts/${address}`}>{textEllipsis(address ?? '', 6)}</Link>;
};
