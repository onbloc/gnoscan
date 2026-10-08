import styled from "styled-components";

import { media } from "@/common/values/ui.constant";
import { innerLayoutCss } from "@/styles/css/inner-layout";

export const Container = styled.main`
  width: 100%;
  flex: 1;
  padding: 24px 0px;

  ${media.DESKTOP} {
    padding: 48px 0px;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${innerLayoutCss};

  ${media.DESKTOP} {
    gap: 32px;
  }
`;
