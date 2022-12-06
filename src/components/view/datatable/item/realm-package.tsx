import Link from 'next/link';
import React from 'react';

interface Props {
  packagePath: string;
}

export const RealmPakage = ({packagePath}: Props) => {
  return (
    <Link href={`/realms/${encodeURIComponent(packagePath)}`}>
      <span className="ellipsis link">{packagePath}</span>
    </Link>
  );
};
