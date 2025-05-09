import React, { useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { textEllipsis } from "@/common/utils/string-util";
import Tooltip from "@/components/ui/tooltip";

interface Props {
  publisher: string | undefined;
  publisherUsername: string | undefined;
}

export const Owner = ({ publisher, publisherUsername }: Props) => {
  const { getUrlWithNetwork } = useNetwork();
  const renderTooltip = () => {
    return <TooltipWrapper>{publisher}</TooltipWrapper>;
  };

  const displayName = useMemo(() => {
    if (publisherUsername) {
      return publisherUsername;
    }

    if (publisher) {
      return textEllipsis(publisher, 8);
    }

    return "-";
  }, [publisher, publisherUsername]);

  return (
    <Container>
      {publisher && publisher !== "genesis" ? (
        <Tooltip content={renderTooltip()}>
          <OwnerLink href={getUrlWithNetwork(`/account/${publisher}`)}>
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
