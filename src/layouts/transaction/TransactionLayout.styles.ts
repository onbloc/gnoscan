import styled from "styled-components";
import { innerLayoutCss } from "@/styles/css/inner-layout";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

export const Container = styled.main<{ breakpoint: DEVICE_TYPE }>`
  width: 100%;
  flex: 1;
  padding: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "40px 16px" : "24px 0px")};
`;

export const InnerLayout = styled.div`
  ${innerLayoutCss}
`;

export const Wrapper = styled.div<{ breakpoint: DEVICE_TYPE }>`
  display: flex;
  flex-direction: column;
  gap: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "24px" : "16px")};

  width: 100%;
  padding: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "24px" : "16px")};
  border-radius: 10px;

  background-color: ${({ theme }) => theme.colors.surface};

  .svg-icon {
    stroke: ${({ theme }) => theme.colors.primary};
    margin-left: 5px;
  }

  .badge {
    display: inline-flex;
    line-height: 1em;
    height: 28px;
    justify-content: center;
    align-items: center;
  }
`;
