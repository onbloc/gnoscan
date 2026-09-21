import React, { useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useUsername } from "@/common/hooks/account/use-username";
import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import Tooltip from "@/components/ui/tooltip";

interface Props {
  address: string | undefined;
  addressName?: string;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
}

export const Account = ({ address, addressName, label, labelType }: Props) => {
  const { getName } = useUsername();
  const { getUrlWithNetwork } = useNetwork();
  const renderTooltip = () => {
    return <TooltipWrapper>{address}</TooltipWrapper>;
  };

  const resolvedName = addressName || (address ? getName(address) : undefined);

  const displayName = useMemo(() => {
    if (resolvedName) return resolvedName;

    if (label) return stripGnoLandPrefix(label);

    if (!address) {
      return "-";
    }

    return textEllipsis(address, 6);
  }, [address, resolvedName, label]);

  return (
    <Tooltip content={renderTooltip()}>
      <TooltipWrapper>
        <Link
          className="ellipsis"
          href={getUrlWithNetwork(getAddressLinkPath({ address, name: resolvedName, label, labelType }))}
        >
          {displayName}
        </Link>
      </TooltipWrapper>
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
