import React from "react";

import * as S from "./StakedBadge.styles";

interface StakedBadgeProps {
  // "card" follows the artwork overlay design; "inline" matches a neighbouring symbol badge.
  size?: S.StakedBadgeSize;
}

// Marks a gnoswap position held by the staker; callers decide placement.
const StakedBadge = ({ size = "card" }: StakedBadgeProps) => <S.Badge $size={size}>Staked</S.Badge>;

export default StakedBadge;
