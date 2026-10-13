import styled from "styled-components";

import { innerLayoutCss } from "@/styles/css/inner-layout";
import { LinkWrapper } from "@/components/ui/detail-page-common-styles";

export const Container = styled.main`
  width: 100%;
  flex: 1;
  padding: 40px 0;
`;

export const InnerLayout = styled.div`
  ${innerLayoutCss}
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  width: 100%;
  padding: 24px;
  border-radius: 10px;

  background-color: ${({ theme }) => theme.colors.surface};
`;

export const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;

  @media (max-width: 767px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
`;

export const TokenResourceLink = styled(LinkWrapper)`
  align-self: center;
  flex-shrink: 0;

  @media (max-width: 767px) {
    align-self: flex-start;
  }
`;
