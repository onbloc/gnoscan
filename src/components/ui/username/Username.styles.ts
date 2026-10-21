import styled, { css } from "styled-components";
import { media } from "@/common/values/ui.constant";
import Text from "@/components/ui/text";

const flexStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
`;

export const ContentWrapper = styled.div`
  ${flexStyle};
  gap: 10px;
  a {
    ${flexStyle}
  }
  ${media.DESKTOP} {
    gap: 20px;
  }
`;

export const Username = styled(Text)`
  position: relative;
  display: flex;
  align-items: center;
`;
