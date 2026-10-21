import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { textEllipsis } from "@/common/utils/string-util";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import { useNetwork } from "@/common/hooks/use-network";

interface Props {
  caller: string;
  username?: string | undefined;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
}

export const CallerCopy = ({ caller, username, label, labelType }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  return (
    <CallerWrapper>
      <Link
        className="ellipsis"
        href={getUrlWithNetwork(getAddressLinkPath({ address: caller, name: username, label, labelType }))}
      >
        {textEllipsis(username ?? "", 6) || (label ? stripGnoLandPrefix(label) : textEllipsis(caller ?? "", 6))}
        <CopyTooltip variant="path" copyText={caller} />
      </Link>
    </CallerWrapper>
  );
};

const CallerWrapper = styled.div`
  & {
    display: flex;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;

    a {
      width: 100%;
    }

    .status {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 5px;
    }
  }
`;
