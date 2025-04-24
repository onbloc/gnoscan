import styled from "styled-components";

import { DEVICE_TYPE } from "@/common/values/ui.constant";

import Text from "@/components/ui/text";
import { AmountText } from "@/components/ui/text/amount-text";

export const Box = styled.div<{ breakpoint: DEVICE_TYPE }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "16px 24px" : "12px 16px")};

  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
`;

export const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  jutify-content: center;
  gap: 16px;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color ${({ theme }) => theme.colors.base}:
  border-radius: 50%;

  .logo-icon {
    fill: ${({ theme }) => theme.colors.primary};
  }
  img {
    width: 40px;
    height: 40px;
  }
`;

export const TokenName = styled(Text)``;
