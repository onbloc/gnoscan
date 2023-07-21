import Link from 'next/link';
import React from 'react';

interface Props {
  packagePath: string;
}

export const RealmPakage = ({packagePath}: Props) => {
  return (
    <a href={`/realms/details?path=${packagePath}`}>
      <span className="ellipsis link">
        {packagePath ? packagePath.replace('gno.land', '') : '-'}
      </span>
    </a>
  );
};
