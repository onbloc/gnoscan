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
  justify-content: center;
  gap: 16px;
  min-width: 0;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 50%;
  flex: 0 0 40px;

  .logo-icon {
    fill: ${({ theme }) => theme.colors.primary};
  }
  img {
    width: 40px;
    height: 40px;
  }
`;

export const TokenName = styled(Text)`
  white-space: nowrap;
`;

export const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
`;

export const TokenPathLink = styled.a`
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  width: fit-content;
  max-width: 100%;
  color: ${({ theme }) => theme.colors.gray300};
  transition: opacity 0.2s;

  :hover {
    opacity: 0.6;
  }

  .icon-link {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;

    * {
      stroke: ${({ theme }) => theme.colors.gray300};
    }
  }
`;

export const AmountInfo = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;
