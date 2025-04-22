import { formatEllipsis } from "@/common/utils";
import Tooltip from "@/components/ui/tooltip";
import React from "react";
import styled from "styled-components";

interface Props {
  pkgPath: string | undefined;
}

export const PkgPath = ({ pkgPath }: Props) => {
  const renderTooltip = () => {
    return <TooltipWrapper>{pkgPath}</TooltipWrapper>;
  };

  const getDisplayPkgPath = (pkgPath?: string | undefined) => {
    return pkgPath ? pkgPath : "-";
  };

  return (
    <Container>
      {pkgPath ? (
        <Tooltip content={renderTooltip()}>
          <PkgPathText className="tooltip-path">{getDisplayPkgPath(pkgPath)}</PkgPathText>
        </Tooltip>
      ) : (
        <PkgPathText>{getDisplayPkgPath(pkgPath)}</PkgPathText>
      )}
    </Container>
  );
};

const Container = styled.div`
  &,
  & * {
    width: 100%;
  }
`;

const PkgPathText = styled.span`
  color: ${({ theme }) => theme.colors.reverse};
  &.tooltip-path {
    cursor: pointer;
  }
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

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
