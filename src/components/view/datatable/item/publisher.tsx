import React, { useMemo } from "react";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import Tooltip from "@/components/ui/tooltip";

interface Props {
  username: string | undefined;
  address: string | undefined;
  ellipsisNumber?: number;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
}

export const Publisher = ({ address, username, ellipsisNumber = 8, label, labelType }: Props) => {
  const { getUrlWithNetwork } = useNetwork();

  const renderTooltip = () => {
    return <TooltipWrapper>{address}</TooltipWrapper>;
  };

  const displayName = useMemo(() => {
    if (username) {
      return username;
    }

    if (label) {
      return stripGnoLandPrefix(label);
    }

    if (!address) {
      return "-";
    }

    return textEllipsis(address ?? "", ellipsisNumber);
  }, [address, username, label, ellipsisNumber]);

  return address && address !== "genesis" ? (
    <PublisherTooltip content={renderTooltip()}>
      <a
        className="ellipsis"
        href={getUrlWithNetwork(getAddressLinkPath({ address, name: username, label, labelType }))}
      >
        {displayName}
      </a>
    </PublisherTooltip>
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

// Bound the tooltip to the column so long names get the CSS ellipsis
const PublisherTooltip = styled(Tooltip)`
  max-width: 100%;

  a {
    min-width: 0;
  }
`;
