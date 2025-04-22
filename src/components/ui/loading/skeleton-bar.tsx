import mixins from "@/styles/mixins";
import React, { CSSProperties } from "react";
import styled from "styled-components";
import { SkeletonBoxStyle } from "./skeleton-box";

interface SkeletonBarProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  margin?: CSSProperties["margin"];
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
`;

export const SkeletonBar = ({ width, height, margin }: SkeletonBarProps) => {
  return <SkeletonBarStyle width={width} height={height} margin={margin} />;
};
