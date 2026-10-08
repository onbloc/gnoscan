import styled from "styled-components";
import { innerLayoutCss } from "@/styles/css/inner-layout";
import { media } from "@/common/values/ui.constant";

export const Container = styled.main`
  width: 100%;
  flex: 1;
  padding: 24px 0px;

  ${media.DESKTOP} {
    padding: 40px 16px;
  }
`;

export const InnerLayout = styled.div`
  ${innerLayoutCss}
`;

export const TitleWrapper = styled.div<{ isDesktop: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ isDesktop }) => (isDesktop ? "flex-start" : "space-between")};
  gap: 16px;

  width: 100%;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  padding: 16px;
  border-radius: 10px;

  background-color: ${({ theme }) => theme.colors.surface};

  .badge {
    display: inline-flex;
    line-height: 1em;
    height: 28px;
    justify-content: center;
    align-items: center;
  }

  ${media.DESKTOP} {
    gap: 24px;
    padding: 24px;
  }
`;
