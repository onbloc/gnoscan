import mixins from "@/styles/mixins";
import React, { CSSProperties } from "react";
import styled from "styled-components";
import { SkeletonBoxStyle } from "./skeleton-box";

interface SkeletonBarProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  margin?: CSSProperties["margin"];
  borderRadius?: CSSProperties["borderRadius"];
}

const SkeletonBarStyle = styled(SkeletonBoxStyle)<SkeletonBarProps>`
  width: ${({ width }) => {
    if (width) return typeof width === "number" ? `${width}px` : width;
    return "100%";
  }};
  height: ${({ height }) => {
    if (height) return typeof height === "number" ? `${height}px` : height;
    return "28px";
  }};
  margin: ${({ margin }) => margin && margin};
  border-radius: ${({ borderRadius }) => {
    if (borderRadius) return typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
    return 0;
  }};
`;

export const SkeletonBar = ({ width, height, margin, borderRadius }: SkeletonBarProps) => {
  return <SkeletonBarStyle width={width} height={height} margin={margin} borderRadius={borderRadius} />;
};
