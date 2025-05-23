import styled, { css } from "styled-components";

import mixins from "@/styles/mixins";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { SkeletonBoxStyle } from "@/components/ui/loading";

import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";

export const Card = styled.div<{ isDesktop: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 10px;
  width: 100%;
  padding: ${({ isDesktop }) => (isDesktop ? "24px" : "16px")};
`;

export const Box = styled.div<{ isDesktop: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  padding: ${({ isDesktop }) => (isDesktop ? "22px 24px" : "12px 16px")};

  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
`;

export const AccountWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;

  svg {
    margin-left: 5px;
    stroke: ${({ theme }) => theme.colors.primary};
  }
`;

const flexStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
`;

export const ContentWrapper = styled.div<{ isDesktop: boolean }>`
  ${flexStyle};
  gap: ${({ isDesktop }) => (isDesktop ? "20px" : "10px")};
  a {
    ${flexStyle}
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`;

export const Content = styled(Text)`
  word-break: break-all;
`;

export const CopyTooltip = styled(Tooltip)`
  display: inline-flex;
  height: 20px;
  justify-content: center;
  align-items: center;
`;

export const Username = styled(Text)<{ breakpoint: DEVICE_TYPE }>`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SkeletonBox = styled(SkeletonBoxStyle)<{
  width?: string;
  marginTop?: number;
  marginBottom?: number;
  height?: number;
}>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: ${({ width }) => width ?? "100%"};
  margin-top: ${({ marginTop }) => (marginTop ? `${marginTop}px` : "0")};
  margin-bottom: ${({ marginBottom }) => (marginBottom ? `${marginBottom}px` : "0")};
  height: ${({ height }) => (height ? `${height}px` : "28px")};
`;
