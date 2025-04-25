import styled from "styled-components";

import mixins from "@/styles/mixins";
import { SkeletonBoxStyle } from "@/components/ui/loading";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 10px;
  width: 100%;
  padding: 24px;
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
