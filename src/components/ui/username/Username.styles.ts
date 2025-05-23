import styled, { css } from "styled-components";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import Text from "@/components/ui/text";

const flexStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
`;

export const ContentWrapper = styled.div<{ isDesktop: boolean }>`
  ${flexStyle};
  gap: ${({ isDesktop }) => (isDesktop ? "20px" : "10px")};
  a {
    ${flexStyle}
  }
`;

export const Username = styled(Text)<{ breakpoint: DEVICE_TYPE }>`
  position: relative;
  display: flex;
  align-items: center;
`;
