import React, { useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useUsername } from "@/common/hooks/account/use-username";
import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";
import Tooltip from "@/components/ui/tooltip";

interface Props {
  address: string | undefined;
}

export const Account = ({ address }: Props) => {
  const { getName } = useUsername();
  const { getUrlWithNetwork } = useNetwork();
  const renderTooltip = () => {
    return <TooltipWrapper>{address}</TooltipWrapper>;
  };

  const displayName = useMemo(() => {
    if (!address) {
      return "-";
    }

    return getName(address) || textEllipsis(address ?? "", 6);
  }, [address]);

  return (
    <Tooltip content={renderTooltip()}>
      <Link className="ellipsis" href={getUrlWithNetwork(`/account/${address}`)}>
        {displayName}
      </Link>
    </Tooltip>
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

    .ellipsis {
      max-width: 128px;
    }
  }
`;
