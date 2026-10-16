import React from "react";
import styled from "styled-components";

import { Badge, StakedBadgeSize } from "../staked-badge/StakedBadge.styles";

interface BurnBadgeProps {
  size?: StakedBadgeSize;
}

const BurnBadge = ({ size = "card" }: BurnBadgeProps) => <BadgeStyle $size={size}>Burn</BadgeStyle>;

// Figma 6564:11967: red pill in the artwork's top-right corner.
const BadgeStyle = styled(Badge)`
  min-width: ${({ $size }) => ($size === "card" ? "34px" : "auto")};
  background-color: #f44336;
`;

export default BurnBadge;
