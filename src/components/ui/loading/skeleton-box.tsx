import styled, {keyframes} from 'styled-components';

const pulseKeyframe = keyframes`
  to {
		transform: translateX(100%);
	}
`;

export const SkeletonBoxStyle = styled.div`
  & {
    position: relative;
    background-color: ${({theme}) => theme.colors.dimmed50};
    padding: 0px 17px 0px 14px;
    overflow: hidden;
  }

  &::after {
    position: absolute;
    display: inline-block;
    top: 0;
    right: 100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      270deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(170, 170, 170, 0.32) 30%,
      rgba(0, 0, 0, 0) 70%,
      rgba(170, 170, 170, 0.32) 100%
    );
    animation: ${pulseKeyframe} 2s ease infinite;
    content: '';
  }
`;
