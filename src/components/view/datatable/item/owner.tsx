import React, { useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import Tooltip from "@/components/ui/tooltip";

interface Props {
  publisher: string | undefined;
  publisherUsername: string | undefined;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
}

export const Owner = ({ publisher, publisherUsername, label, labelType }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const renderTooltip = () => {
    return <TooltipWrapper>{publisher}</TooltipWrapper>;
  };

  const displayName = useMemo(() => {
    if (publisherUsername) {
      return publisherUsername;
    }

    if (label) {
      return label;
    }

    if (publisher) {
      return textEllipsis(publisher, 8);
    }

    return "-";
  }, [publisher, publisherUsername, label]);

  return (
    <Container>
      {publisher && publisher !== "genesis" ? (
        <Tooltip content={renderTooltip()}>
          <OwnerLink href={getUrlWithNetwork(getAddressLinkPath({ address: publisher, label, labelType }))}>
            <OwnerText>{displayName}</OwnerText>
          </OwnerLink>
        </Tooltip>
      ) : (
        <OwnerText>{displayName}</OwnerText>
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

const OwnerLink = styled(Link)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OwnerText = styled.span`
  width: 100%;
  color: ${({ theme }) => theme.colors.blue};
`;

const TooltipWrapper = styled.span`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  justify-content: center;
  align-items: center;
  word-break: keep-all;
  white-space: nowrap;
`;
