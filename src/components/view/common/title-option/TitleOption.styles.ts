import styled from "styled-components";
import mixins from "@/styles/mixins";
import { ButtonProps } from "@/components/ui/button";

export const TitleWrap = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  gap: 8px;
`;

export const ArrowButton = styled.a<ButtonProps>`
  ${mixins.flexbox("row", "center", "center")};
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme, disabled }) => (disabled ? theme.colors.gray100 : theme.colors.dimmed100)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  svg {
    fill: ${({ theme, disabled }) => (disabled ? theme.colors.gray200 : theme.colors.reverse)};
    &.icon-arrow-right {
      transform: rotate(180deg);
    }
  }
`;
