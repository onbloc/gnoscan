import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

import { innerLayoutCss } from "@/styles/css/inner-layout";
import { SkeletonBoxStyle } from "@/components/ui/loading";

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

// Same height as PageTitle (p2, h2 on desktop)
export const TitleSkeleton = styled(SkeletonBoxStyle)`
  width: 200px;
  height: 24px;
  border-radius: 0;

  ${media.DESKTOP} {
    height: 36px;
  }
`;
