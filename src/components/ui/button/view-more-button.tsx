import React from "react";
import styled from "styled-components";
import Text from "@/components/ui/text";
import mixins from "@/styles/mixins";
import { media } from "@/common/values/ui.constant";
import { Button } from "./button";

interface ViewMoreButtonProps {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  text?: string;
  // "table" renders the paging button shown below datatables
  variant?: "default" | "table";
}

export const ViewMoreButton = ({
  onClick,
  disabled = false,
  text = "View More Transactions",
  variant = "default",
}: ViewMoreButtonProps) => {
  if (variant === "table") {
    return (
      <TableWrapper className="view-more-button" onClick={onClick} disabled={disabled} fullWidth>
        {text}
      </TableWrapper>
    );
  }

  return (
    <Wrapper onClick={onClick} disabled={disabled} fullWidth height="52px">
      <Text type="h7" color="reverse">
        {text}
      </Text>
    </Wrapper>
  );
};

const Wrapper = styled(Button)`
  ${mixins.flexbox("row", "center", "center")};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
  margin: 24px auto 0px;
  :disabled {
    opacity: 0.6;
    color: ${({ theme }) => theme.colors.dimmed200};
  }
  ${media.DESKTOP} {
    width: 344px;
  }
`;

const TableWrapper = styled(Button)`
  padding: 16px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  ${({ theme }) => theme.fonts.p4};
  font-weight: 600;
  ${media.DESKTOP} {
    width: 344px;
  }
`;
