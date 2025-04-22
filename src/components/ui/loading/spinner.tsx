import mixins, { MixinsType } from "@/styles/mixins";
import React from "react";
import styled, { css, CSSProp, keyframes } from "styled-components";

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinRing = styled.div<{ position?: CSSProp }>`
  ${mixins.flexbox("row", "center", "center")};

  ${({ position }) =>
    position === "center"
      ? css`
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -35px;
          margin-top: -35px;
        `
      : css`
          position: relative;
        `}
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-image: ${({ theme }) =>
    `linear-gradient(359.87deg, ${theme.colors.select} 8.53%, rgba(0, 0, 0, 0) 69.1%)`};
  animation: ${spinAnimation} 0.9s linear infinite;
  :before {
    content: "";
    background-color: ${({ theme }) => theme.colors.surface};
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
`;

const SpinBall = styled.span`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.base};
`;

export const Spinner = ({ position }: { position?: string }) => (
  <SpinRing position={position}>
    <SpinBall />
  </SpinRing>
);
