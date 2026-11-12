import styled from "styled-components";

import { media } from "@/common/values/ui.constant";
import { zindex } from "@/common/values/z-index";
import mixins from "@/styles/mixins";

// Rows per page on the left and the pagination in the middle.
export const Footer = styled.div`
  display: grid;
  width: 100%;
  box-sizing: border-box;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: "size page .";
  align-items: center;
  padding: 0 24px;

  ${media.MOBILE} {
    grid-template-columns: 1fr;
    grid-template-areas:
      "page"
      "size";
    justify-items: center;
    row-gap: 8px;
    padding: 0 16px 16px;
  }
`;

export const SizeArea = styled.div`
  grid-area: size;
  ${mixins.flexbox("row", "center", "flex-start", false)};
  gap: 8px;
`;

// The menu is placed against the trigger, not the whole grid cell.
export const SizeSelect = styled.div`
  position: relative;
`;

export const PageArea = styled.div`
  grid-area: page;
`;

// Same font as the "Page 1 of N" text of the pagination, in the muted color of a label.
export const SizeLabel = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  white-space: nowrap;
  ${({ theme }) => theme.fonts.p4};
`;

export const SizeTrigger = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  gap: 8px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid ${({ theme }) => theme.colors.dimmed100};
  border-radius: 8px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  ${({ theme }) => theme.fonts.p4};
`;

// The chevron of the icon points up; it points down while the menu is closed.
export const SizeChevron = styled.span<{ $open: boolean }>`
  ${mixins.flexbox("row", "center", "center")};
  transform: ${({ $open }) => ($open ? "none" : "rotate(180deg)")};

  svg {
    width: 10px;
    height: 6px;
  }
`;

// As wide as the trigger, and no taller than its four values need.
export const SizeMenu = styled.ul`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  z-index: ${zindex.headerDropdown};
  width: max-content;
  min-width: 100%;
  margin: 0;
  padding: 3px;
  list-style: none;
  border: 1px solid ${({ theme }) => theme.colors.dimmed50};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
`;

export const SizeOption = styled.button<{ $selected: boolean }>`
  display: block;
  width: 100%;
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 6px;
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.select : "transparent")};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.reverse : theme.colors.tertiary)};
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  ${({ theme }) => theme.fonts.p4};

  :hover,
  :focus-visible {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;
