import Link from "next/link";
import React, { useMemo } from "react";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";
import { getAddressLinkPath, isScamLabel } from "@/common/utils/address-label.utility";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { EllipsisTooltip } from "@/components/ui/tooltip";
import { WithPhishingWarning } from "@/components/ui/tooltip/phishing-warning-tooltip/PhishingWarningTooltip";

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
    <WithPhishingWarning labelType={labelType} small>
      <EllipsisTooltip content={renderTooltip()}>
        <PublisherLink
          // Shortened addresses are already middle truncated, so only clip names and labels.
          // A flagged address is clipped too so the warning icon never overlaps the text in a narrow cell.
          className={username || label || isScamLabel(labelType) ? "ellipsis" : undefined}
          href={getUrlWithNetwork(getAddressLinkPath({ address, name: username, label, labelType }))}
        >
          {displayName}
        </PublisherLink>
      </EllipsisTooltip>
    </WithPhishingWarning>
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

const PublisherLink = styled(Link)`
  white-space: nowrap;

  &:not(.ellipsis) {
    flex-shrink: 0;
  }
`;
