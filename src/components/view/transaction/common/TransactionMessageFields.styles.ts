import styled from "styled-components";
import mixins from "@/styles/mixins";

import IconCopy from "@/assets/svgs/icon-copy.svg";

export const AddressTextBox = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  .address-tooltip {
    vertical-align: text-bottom;
  }
`;

export const StyledIconCopy = styled(IconCopy)`
  stroke: ${({ theme }) => theme.colors.primary};
  margin-left: 5px;
`;

export const BadgeContentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const BadgeListWrapper = styled.div<{ isDesktop: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ isDesktop }) => (isDesktop ? "12px" : "0px")};
`;

export const TooltipContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;

  .info {
    width: 100%;
    height: fit-content;
    padding: 6px 10px;
    ${({ theme }) => theme.fonts.p4};
    color: ${({ theme }) => theme.colors.blue};
    background-color: ${({ theme }) => theme.colors.pantone};
    border-radius: 4px;
  }
`;
