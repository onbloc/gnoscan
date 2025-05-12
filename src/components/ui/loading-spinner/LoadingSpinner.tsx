import styled, { keyframes } from "styled-components";

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner = ({ size = 12 }: LoadingSpinnerProps) => {
  return <StyledLoadingSpinner size={size} />;
};

export default LoadingSpinner;

const spinAnimation = keyframes`
  100% {
    transform: rotate(1turn);
  }
`;

const StyledLoadingSpinner = styled.div<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};

  border: 2px solid rgba(0, 0, 0, 0);
  border-left: ${({ theme }) => `2px solid ${theme.colors.primary}`};
  border-radius: 9999px;

  animation-name: ${spinAnimation};
  animation-duration: 1000ms;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-timeline: auto;
  animation-range-start: normal;
  animation-range-end: normal;
`;
