import React, { useLayoutEffect, useRef } from "react";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { formatDisplayTokenPath, stripGnoLandPrefix } from "@/common/utils/token.utility";
import { truncateStartToWidth } from "@/common/utils/string-util";

import Tooltip from "@/components/ui/tooltip";

interface Props {
  packagePath: string;
  maxWidth?: number;
  /** Cut overflow at the front so the realm name at the end stays visible. */
  truncateStart?: boolean;
}

export const RealmPackage = ({ packagePath, maxWidth, truncateStart }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const displayPackagePath = formatDisplayTokenPath(stripGnoLandPrefix(packagePath), 4);
  const textRef = useRef<HTMLSpanElement>(null);

  // Measured in the link's own font and written before paint, so "…" starts at the left edge
  // like the untruncated rows instead of leaving the gap a CSS start ellipsis does.
  useLayoutEffect(() => {
    const text = textRef.current;
    const context = truncateStart && text ? document.createElement("canvas").getContext("2d") : null;
    if (!text || !context) return;
    context.font = getComputedStyle(text).font;
    text.textContent = truncateStartToWidth(
      displayPackagePath,
      maxWidth || 170,
      value => context.measureText(value).width,
    );
  }, [truncateStart, displayPackagePath, maxWidth]);

  return (
    <Tooltip content={<TooltipContent packagePath={packagePath} />}>
      <PackagePathLink
        className="ellipsis"
        maxWidth={maxWidth || 170}
        href={getUrlWithNetwork(`/realms/details?path=${packagePath}`)}
      >
        <span className="link" ref={textRef}>
          {displayPackagePath}
        </span>
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
