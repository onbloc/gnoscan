import Tooltip from '@/components/ui/tooltip';
import React from 'react';
import styled from 'styled-components';

interface Props {
  packagePath: string;
  maxWidth?: number;
}

export const RealmPakage = ({packagePath, maxWidth}: Props) => {
  const displayPackagePath = packagePath.replace('gno.land', '');

  return (
    <Tooltip content={<TooltipContent packagePath={packagePath} />}>
      <PackagePathLink
        className="ellipsis"
        maxWidth={maxWidth || 170}
        href={`/realms/details?path=${packagePath}`}>
        <span className="link">{displayPackagePath}</span>
      </PackagePathLink>
    </Tooltip>
  );
};

const PackagePathLink = styled.a<{maxWidth: number}>`
  max-width: ${({maxWidth}) => `${maxWidth}px`};
`;

const TooltipContent: React.FC<{packagePath: string}> = ({packagePath}) => (
  <TooltipWrapper>{packagePath}</TooltipWrapper>
);

const TooltipWrapper = styled.span`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;
    word-break: keep-all;
    white-space: nowrap;
  }
`;
