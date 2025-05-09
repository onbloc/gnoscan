import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import Tooltip from "@/components/ui/tooltip";

interface Props {
  packagePath: string;
  maxWidth?: number;
}

export const RealmPackage = ({ packagePath, maxWidth }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const displayPackagePath = packagePath?.replace("gno.land", "");

  return (
    <Tooltip content={<TooltipContent packagePath={packagePath} />}>
      <PackagePathLink
        className="ellipsis"
        maxWidth={maxWidth || 170}
        href={getUrlWithNetwork(`/realms/details?path=${packagePath}`)}
      >
        <span className="link">{displayPackagePath}</span>
      </PackagePathLink>
    </Tooltip>
  );
};

const PackagePathLink = styled(Link)<{ maxWidth: number }>`
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
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
