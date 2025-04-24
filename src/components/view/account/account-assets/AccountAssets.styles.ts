import styled from "styled-components";

import { DEVICE_TYPE } from "@/common/values/ui.constant";

import Text from "@/components/ui/text";

export const Card = styled.div<{ breakpoint: DEVICE_TYPE }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 10px;
  width: 100%;
  padding: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "24px" : "16px")};
`;

export const GridLayout = styled.div<{ breakpoint: DEVICE_TYPE }>`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "repeat(2, 1fr)" : "1fr")};
  grid-template-rows: auto;
  grid-gap: 16px;
`;

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
