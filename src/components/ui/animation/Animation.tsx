import styled, { css, keyframes } from "styled-components";

type RiseInProps = {
  delay?: number;
  children?: React.ReactNode;
};

const riseInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const RiseInStyles = css<{ count?: number; delay?: number }>`
  opacity: 0;
  animation-name: ${riseInAnimation};
  animation-fill-mode: forwards;
  animation-duration: 1000ms;
  animation-iteration-count: 1;
  animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  animation-delay: ${props => 1000 * (props.delay ?? 0)}ms;
`;

export const RiseInText = styled.span<{ delay?: number }>`
  display: inline-flex;
  ${RiseInStyles}
`;

export const RiseIn = styled.span<{ delay?: number }>`
  display: flex;
  width: 100%;
  flex: none;
  justify-content: center;
  pointer-events: none;
  ${RiseInStyles}
`;

const stretchOutAnimation = keyframes`
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
`;

const StretchOutStyles = css<{ delay?: number }>`
  transform-origin: center;
  transform: scaleX(0);
  animation-name: ${stretchOutAnimation};
  animation-fill-mode: forwards;
  animation-duration: 1000ms;
  animation-iteration-count: 1;
  animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  animation-delay: ${props => 1000 * (props.delay ?? 0)}ms;
`;

export const StretchOut = styled.div<{ delay?: number }>`
  display: flex;
  width: 100%;
  justify-content: center;
  ${StretchOutStyles}
`;
