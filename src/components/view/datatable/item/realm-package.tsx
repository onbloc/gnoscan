import React from "react";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import PathText from "@/components/ui/path-text/PathText";

import Tooltip from "@/components/ui/tooltip";

interface Props {
  packagePath: string;
  maxWidth?: number;
}

export const RealmPackage = ({ packagePath, maxWidth }: Props) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <Tooltip content={<TooltipContent packagePath={packagePath} />}>
      <PackagePathLink
        className="ellipsis"
        maxWidth={maxWidth || 170}
        href={getUrlWithNetwork(`/realms/details?path=${packagePath}`)}
      >
        <PathText path={stripGnoLandPrefix(packagePath)} />
      </PackagePathLink>
    </Tooltip>
  );
};

const PackagePathLink = styled.a<{ maxWidth: number }>`
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
