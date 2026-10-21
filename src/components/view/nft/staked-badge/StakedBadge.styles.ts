import styled, { css, FlattenSimpleInterpolation } from "styled-components";

import { media } from "@/common/values/ui.constant";

export type StakedBadgeSize = "card" | "inline";

const SIZES: Record<StakedBadgeSize, FlattenSimpleInterpolation> = {
  // Figma 6712:6791: 40×15 pill over the artwork.
  card: css`
    min-width: 40px;
    height: 15px;
    padding: 0 6px;
    font-size: 9px;
    line-height: 15px;
  `,
  // Next to the symbol badge in the token panel header: same box and typography.
  inline: css`
    height: 24px;
    padding: 2px 10px;
    font-size: 12px;
    line-height: 20px;

    ${media.DESKTOP} {
      font-size: 13px;
    }
  `,
};

export const Badge = styled.span<{ $size: StakedBadgeSize }>`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background-color: ${({ theme }) => theme.colors.blue};
  border-radius: 10px;
  ${({ $size }) => SIZES[$size]}
`;
