import styled, { css } from "styled-components";

export const Frame = styled.div<{ isPlaceholder: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: ${({ isPlaceholder }) => (isPlaceholder ? "0" : "var(--nft-image-radius, 8px)")};

  ${({ isPlaceholder, theme }) =>
    isPlaceholder &&
    css`
      background: ${theme.colors.nftPlaceholder} center / 100% 100% no-repeat;
    `}

  .nft-default-icon {
    display: block;
    width: 28.7549px;
    height: 31.2404px;
    background: ${({ theme }) => theme.colors.nftPlaceholderIcon} center / contain no-repeat;
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const Loading = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @keyframes nft-artwork-rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  svg {
    width: 50px;
    height: 50.5px;
    animation: nft-artwork-rotating 1s linear infinite;
  }

  stop {
    stop-color: #808080;
  }

  circle {
    fill: #808080;
  }
`;
