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
  border-radius: 8px;

  ${({ isPlaceholder, theme }) =>
    isPlaceholder &&
    css`
      background: ${theme.colors.nftPlaceholder};
      border: 1px solid ${theme.colors.nftPlaceholderBorder};
    `}

  .nft-default-icon {
    width: 36px;
    height: 40px;
    color: #858e99;
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
