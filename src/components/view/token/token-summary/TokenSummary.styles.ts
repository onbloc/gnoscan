import Link from "next/link";
import styled from "styled-components";
import mixins from "@/styles/mixins";

export const StyledA = styled(Link)`
  ${mixins.flexbox("row", "center", "center")};
`;

export const Divider = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
`;

export const PriceText = styled.span`
  ${mixins.flexbox("row", "center", "flex-start")};
  white-space: nowrap;
`;
