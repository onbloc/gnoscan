import React, { useMemo } from "react";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";
import Tooltip from "@/components/ui/tooltip";

interface Props {
  username: string | undefined;
  address: string | undefined;
  ellipsisNumber?: number;
}

export const Publisher = ({ address, username, ellipsisNumber = 8 }: Props) => {
  const { getUrlWithNetwork } = useNetwork();

  const renderTooltip = () => {
    return <TooltipWrapper>{address}</TooltipWrapper>;
  };

  const displayName = useMemo(() => {
    if (username) {
      return username;
    }

    if (!address) {
      return "-";
    }

    return textEllipsis(address ?? "", ellipsisNumber);
  }, [address, username]);

  return address && address !== "genesis" ? (
    <Tooltip content={renderTooltip()}>
      <PublisherLink className="ellipsis" href={getUrlWithNetwork(`/account/${address}`)}>
        {displayName}
      </PublisherLink>
    </Tooltip>
  ) : (
    <>{displayName}</>
  );
};

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

const PublisherLink = styled.a`
  max-width: 128px;
`;
