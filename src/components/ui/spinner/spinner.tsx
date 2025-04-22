import mixins from "@/styles/mixins";
import React from "react";
import styled, { keyframes } from "styled-components";

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinRing = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-image: ${({ theme }) => theme.colors.linear};
  animation: ${spinAnimation} 1s linear infinite;
  :before {
    content: "";
    background-color: ${({ theme }) => theme.colors.base};
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
  background-color: ${({ theme }) => theme.colors.surface};
`;

const Spinner = () => (
  <SpinRing>
    <SpinBall />
  </SpinRing>
);

export default Spinner;
