import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { useGetAccountByAddress } from "@/common/react-query/account/api/use-get-account-by-address";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";
import { formatDisplayPackagePath, textEllipsis } from "@/common/utils/string-util";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import Tooltip from "@/components/ui/tooltip";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import { PhishingWarningTooltip } from "@/components/ui/tooltip/phishing-warning-tooltip/PhishingWarningTooltip";
import * as S from "./NftTokenPanel.styles";

interface NftTransferPartyProps {
  address: string;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
}

const NftTransferParty = ({ address, label, labelType }: NftTransferPartyProps) => {
  const { getUrlWithNetwork } = useNetwork();
  // Current-owner labels are already available; resolve other history participants through the shared cache.
  const { data } = useGetAccountByAddress(address, { enabled: !!address && !label });
  const resolvedLabel = label || data?.data.label;
  const resolvedLabelType = label ? labelType : data?.data.labelType;

  return (
    <S.TransferParty $hasLabel={!!resolvedLabel}>
      <Tooltip content={address}>
        <Link
          href={getUrlWithNetwork(getAddressLinkPath({ address, label: resolvedLabel, labelType: resolvedLabelType }))}
        >
          {resolvedLabel ? (
            <TransferLabel>
              <bdi>{formatDisplayPackagePath(stripGnoLandPrefix(resolvedLabel), 6)}</bdi>
            </TransferLabel>
          ) : (
            textEllipsis(address, 6)
          )}
        </Link>
      </Tooltip>
      <PhishingWarningTooltip labelType={resolvedLabelType} />
      <CopyTooltip copyText={address} variant="plain" iconClassName="copy-icon" />
    </S.TransferParty>
  );
};

export default NftTransferParty;

// History rows are too narrow for segment-based fitting; use all available width while keeping the path's end.
const TransferLabel = styled.span`
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;

  bdi {
    direction: ltr;
  }
`;
