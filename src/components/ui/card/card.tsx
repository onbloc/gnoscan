import mixins from "@/styles/mixins";
import React from "react";
import styled, { CSSProperties } from "styled-components";
import { media } from "@/common/values/ui.constant";

interface CardStyleProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: string;
}

interface CardPros extends CardStyleProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, width, height, radius = "10px", className }: CardPros) => {
  return (
    <Wrapper width={width} height={height} radius={radius} className={className}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<CardStyleProps>`
  width: ${({ width }) => {
    if (width) return typeof width === "number" ? `${width}px` : width;
    return "auto";
  }};
  height: ${({ height }) => {
    if (height) return typeof height === "number" ? `${height}px` : height;
    return "auto";
  }};
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  outline: none;
  border-radius: ${({ radius }) => (typeof radius === "number" ? `${radius}px` : radius)};
  position: relative;
  ${media.MOBILE} {
    padding: 24px 16px;
  }
`;
