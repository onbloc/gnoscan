import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

import Text from "@/components/ui/text";

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: 12px 16px;

  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;

  ${media.DESKTOP} {
    padding: 16px 24px;
  }
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

export const TokenName = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const AmountInfo = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;
