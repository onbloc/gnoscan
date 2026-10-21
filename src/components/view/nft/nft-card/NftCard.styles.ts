import styled, { css } from "styled-components";

import { media } from "@/common/values/ui.constant";
import Text from "@/components/ui/text";

export type NftCardSize = "regular" | "compact";

export const Card = styled.div<{ size: NftCardSize; selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;
  padding: ${({ size }) => (size === "compact" ? "9px 9px 10px" : "12px")};
  background-color: ${({ theme }) => theme.colors.nftCard};
  /* Inset so the outline does not shrink the artwork (dark cards have none) */
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.nftCardBorder};
  border-radius: 10px;
  --nft-image-radius: ${({ size }) => (size === "compact" ? "9px / 8px" : "8px")};

  ${({ selected, theme }) =>
    selected &&
    css`
      box-shadow: 0 0 0 2px ${theme.colors.blue};
    `}

  ${media.MOBILE} {
    gap: 8px;
    padding: 8px;
  }
`;

export const Artwork = styled.div`
  position: relative;
  width: 100%;
`;

// 4px inside the artwork's top-right corner.
// Decorative, so clicks pass through to the stretched card button or link below.
export const StatusBadgeSlot = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
  pointer-events: none;
  display: flex;
  gap: 4px;
`;

export const Info = styled.div<{ size: NftCardSize }>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: ${({ size }) => (size === "compact" ? "0 1px" : "0")};
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
`;

export const Title = styled(Text)`
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// Shrinks far faster than the title so a narrow card truncates the symbol first.
// Mobile cards show only the token title, as in the mobile design.
export const SymbolBadge = styled(Text)`
  flex: 0 100 auto;
  min-width: 0;
  max-width: 50%;
  height: 24px;
  padding: 2px 10px;
  // Fills the fixed 24px height (2 + 20 + 2); body1's 16px line box left the text high.
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: ${({ theme }) => theme.colors.nftBadge};
  border-radius: 10px;

  ${media.MOBILE} {
    display: none;
  }
`;
