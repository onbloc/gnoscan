import React from "react";
import Link from "next/link";
import styled, { css } from "styled-components";

import { textEllipsis } from "@/common/utils/string-util";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import Tooltip, { EllipsisTooltip } from "@/components/ui/tooltip";
import PathText from "@/components/ui/path-text/PathText";
import { PhishingWarningTooltip } from "@/components/ui/tooltip/phishing-warning-tooltip/PhishingWarningTooltip";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import { useNetwork } from "@/common/hooks/use-network";

const ADDRESS_ELLIPSIS_LENGTH = 8;

interface Props {
  address: string;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
  truncateFromStart?: boolean;
}

// Realm path for labeled addresses, else shortened address; full-address tooltip and copy icon
export const AddressCopy = ({ address, label, labelType, truncateFromStart = false }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const displayLabel = label ? stripGnoLandPrefix(label) : textEllipsis(address, ADDRESS_ELLIPSIS_LENGTH);
  return (
    <AddressWrapper $truncateFromStart={truncateFromStart}>
      <EllipsisTooltip content={address}>
        <Link className="ellipsis" href={getUrlWithNetwork(getAddressLinkPath({ address, label, labelType }))}>
          {truncateFromStart ? <PathText path={displayLabel} align="right" /> : displayLabel}
        </Link>
      </EllipsisTooltip>
      <PhishingWarningTooltip labelType={labelType} />
      <Tooltip className="copy-tooltip" content="Copied!" trigger="click" copyText={address} width={85}>
        <IconCopy className="svg-icon" />
      </Tooltip>
    </AddressWrapper>
  );
};

const AddressWrapper = styled.div<{ $truncateFromStart: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;

  ${({ $truncateFromStart }) =>
    $truncateFromStart &&
    css`
      flex: 1;
      overflow: hidden;

      > div:first-child {
        flex: 1;
      }

      a {
        display: block;
        width: 100%;
        overflow: hidden;
      }
    `}

  .copy-tooltip {
    flex-shrink: 0;
  }

  .svg-icon {
    stroke: ${({ theme }) => theme.colors.primary};
  }
`;
