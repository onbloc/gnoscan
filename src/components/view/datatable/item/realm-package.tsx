import React from "react";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { formatDisplayTokenPath, stripGnoLandPrefix } from "@/common/utils/token.utility";

import Tooltip from "@/components/ui/tooltip";

interface Props {
  packagePath: string;
  maxWidth?: number;
  // Cut overflow at the front so the realm name at the end stays visible.
  truncateStart?: boolean;
}

export const RealmPackage = ({ packagePath, maxWidth, truncateStart }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const displayPackagePath = formatDisplayTokenPath(stripGnoLandPrefix(packagePath), 4);

  return (
    <Tooltip content={<TooltipContent packagePath={packagePath} />}>
      <PackagePathLink
        className="ellipsis"
        maxWidth={maxWidth || 170}
        $truncateStart={truncateStart}
        href={getUrlWithNetwork(`/realms/details?path=${packagePath}`)}
      >
        {truncateStart ? (
          <bdi className="link">{displayPackagePath}</bdi>
        ) : (
          <span className="link">{displayPackagePath}</span>
        )}
      </PackagePathLink>
    </Tooltip>
  );
};

const PackagePathLink = styled.a<{ maxWidth: number; $truncateStart?: boolean }>`
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  // An RTL box puts the ellipsis on the left, while <bdi> keeps the path itself left to right.
  ${({ $truncateStart }) => $truncateStart && "direction: rtl; text-align: left;"}
`;

const TooltipContent: React.FC<{ packagePath: string }> = ({ packagePath }) => (
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
