import styled from "styled-components";

import { media } from "@/common/values/ui.constant";
import { zindex } from "@/common/values/z-index";
import mixins from "@/styles/mixins";

export const FilterButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  position: relative;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.dimmed100};
  border-radius: 8px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const Badge = styled.span`
  ${mixins.flexbox("row", "center", "center")};
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.fonts.p4};
`;

// Marks a chip as excluded: a red dot with a dash.
export const ExcludeMark = styled.span`
  position: relative;
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.failed};

  ::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 3px;
    left: 3px;
    height: 1.5px;
    margin-top: -0.75px;
    border-radius: 1px;
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

export const Chip = styled.span<{ $excluded?: boolean }>`
  ${mixins.flexbox("row", "center", "center")};
  gap: 6px;
  max-width: 100%;
  padding: 4px 6px 4px 10px;
  border-radius: 6px;
  // Failed color at 10% opacity for an excluded chip.
  background-color: ${({ theme, $excluded }) => ($excluded ? `${theme.colors.failed}1A` : theme.colors.dimmed50)};
  color: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.fonts.p4};

  > span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ChipRemove = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.tertiary};
  font-size: 16px;
  line-height: 1;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.dimmed100};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Overlay = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  position: fixed;
  inset: 0;
  z-index: ${zindex.modal};
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.dimmed600};
  backdrop-filter: blur(2px);
`;

// Header, body and footer are laid out apart so the body is the only part that scrolls.
export const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  max-height: 80dvh;
  overflow: hidden;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.24);
`;

export const Header = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  flex-shrink: 0;
  padding: 24px 24px 16px;

  ${media.MOBILE} {
    padding: 20px 20px 12px;
  }
`;

export const CloseButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.dimmed50};
  }

  svg {
    width: 20px;
    height: 20px;
    stroke: ${({ theme }) => theme.colors.reverse};
  }
`;

export const Body = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  padding: 0 24px 16px;

  ${media.MOBILE} {
    padding: 0 20px 12px;
  }
`;

export const SearchBox = styled.label`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.base};
  transition: border-color 0.15s ease, background-color 0.15s ease;

  :focus-within {
    border-color: ${({ theme }) => theme.colors.blue};
    background-color: ${({ theme }) => theme.colors.surface};
  }

  input {
    flex: 1 1 auto;
    min-width: 0;
    ${({ theme }) => theme.fonts.p4};
    color: ${({ theme }) => theme.colors.primary};
    background: transparent;
    border: 0;
    outline: none;

    ::placeholder {
      color: ${({ theme }) => theme.colors.tertiary};
    }
  }

  svg {
    flex: 0 0 18px;
    width: 18px;
    height: 18px;
    opacity: 0.6;

    path {
      stroke: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const SelectedBox = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 96px;
  overflow-y: auto;
`;

export const ListLabel = styled.div`
  flex-shrink: 0;
  padding: 4px 8px 0;
  color: ${({ theme }) => theme.colors.tertiary};
  ${({ theme }) => theme.fonts.p4};
`;

export const OptionList = styled.ul`
  flex: 1 1 auto;
  min-height: 160px;
  margin: 0 -8px;
  padding: 0 8px;
  overflow-y: auto;
  list-style: none;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.dimmed200} transparent;
`;

// The "i" of the table headers, with a tinted circle so it also shows on the highlighted row.
export const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;

  svg {
    fill: ${({ theme }) => theme.colors.tertiary};

    .icon-tooltip_svg__bg {
      fill: ${({ theme }) => theme.colors.dimmed100};
    }
  }
`;

export const Divider = styled.li`
  height: 1px;
  margin: 4px 8px;
  background-color: ${({ theme }) => theme.colors.dimmed50};
`;

export const Option = styled.label<{ $disabled?: boolean }>`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 12px;
  height: 40px;
  padding: 0 8px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.fonts.p4};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  transition: background-color 0.15s ease;

  :hover {
    background-color: ${({ theme, $disabled }) => ($disabled ? "transparent" : theme.colors.dimmed50)};
  }

  input {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    margin: 0;
    border: 1.5px solid ${({ theme }) => theme.colors.gray200};
    border-radius: 5px;
    background: transparent center / 12px no-repeat;
    appearance: none;
    cursor: inherit;

    :checked {
      border-color: ${({ theme }) => theme.colors.blue};
      background-color: ${({ theme }) => theme.colors.blue};
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 6.5l2.5 2.5 4.5-5' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    }

    // Some labels are unchecked.
    :indeterminate {
      border-color: ${({ theme }) => theme.colors.blue};
      background-color: ${({ theme }) => theme.colors.blue};
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 6h6' stroke='white' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E");
    }

    :focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.blue};
      outline-offset: 2px;
    }
  }

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Footer = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  flex-shrink: 0;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.dimmed50};

  ${media.MOBILE} {
    padding: 12px 20px;
  }
`;

export const Count = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  ${({ theme }) => theme.fonts.p4};
`;

export const Actions = styled.div`
  ${mixins.flexbox("row", "center", "flex-end")};
  gap: 8px;
`;

export const ClearButton = styled.button`
  height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: ${({ theme }) => theme.colors.tertiary};
  ${({ theme }) => theme.fonts.p4};
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.dimmed50};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ApplyButton = styled.button`
  min-width: 88px;
  height: 40px;
  padding: 0 20px;
  border: 0;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.fonts.p4};
  cursor: pointer;
  transition: filter 0.15s ease;

  :hover:enabled {
    filter: brightness(0.92);
  }

  :disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
