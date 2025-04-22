import React from "react";
import styled from "styled-components";
import Text from "@/components/ui/text";
import mixins from "@/styles/mixins";
import { eachMedia } from "@/common/hooks/use-media";
import { Button } from "./button";

interface ViewMoreButtonProps {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  text?: string;
}

export const ViewMoreButton = ({ onClick, disabled = false, text = "View More Transactions" }: ViewMoreButtonProps) => {
  const media = eachMedia();
  return (
    <Wrapper onClick={onClick} disabled={disabled} width={media === "desktop" ? "344px" : "100%"} height="52px">
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
`;
