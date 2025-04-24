import styled from "styled-components";

import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { innerLayoutCss } from "@/styles/css/inner-layout";

export const Container = styled.main<{ breakpoint: DEVICE_TYPE }>`
  width: 100%;
  flex: 1;
  padding: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "48px 0px" : "24px 0px")};
`;

export const Wrapper = styled.div<{ breakpoint: DEVICE_TYPE }>`
  display: flex;
  flex-direction: column;
  gap: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "32px" : "16px")};

  ${innerLayoutCss};
`;
