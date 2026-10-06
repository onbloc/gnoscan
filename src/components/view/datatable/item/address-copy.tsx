import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { textEllipsis } from "@/common/utils/string-util";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import Tooltip, { EllipsisTooltip } from "@/components/ui/tooltip";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import { useNetwork } from "@/common/hooks/use-network";

const ADDRESS_ELLIPSIS_LENGTH = 8;

interface Props {
  address: string;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
}

// Realm path for labeled addresses, else shortened address; full-address tooltip and copy icon
export const AddressCopy = ({ address, label, labelType }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  return (
    <AddressWrapper>
      <EllipsisTooltip content={address}>
        <Link className="ellipsis" href={getUrlWithNetwork(getAddressLinkPath({ address, label, labelType }))}>
          {label ? stripGnoLandPrefix(label) : textEllipsis(address, ADDRESS_ELLIPSIS_LENGTH)}
        </Link>
      </EllipsisTooltip>
      <Tooltip className="copy-tooltip" content="Copied!" trigger="click" copyText={address} width={85}>
        <IconCopy className="svg-icon" />
      </Tooltip>
    </AddressWrapper>
  );
};

const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;

  .copy-tooltip {
    flex-shrink: 0;
  }

  .svg-icon {
    stroke: ${({ theme }) => theme.colors.primary};
  }
`;
