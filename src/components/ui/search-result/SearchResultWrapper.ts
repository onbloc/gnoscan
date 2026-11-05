/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";

import mixins from "@/styles/mixins";
import { zindex } from "@/common/values/z-index";
import { scrollbarStyle } from "@/common/hooks/use-scroll-bar";

interface StyleProps {
  isMain?: boolean;
  ref?: any;
}

/** Dropdown of the search results, placed under the nearest positioned ancestor. */
export const SearchResultWrapper = styled.div<StyleProps>`
  ${scrollbarStyle};
  ${mixins.flexbox("column", "center", "flex-start")};
  width: ${({ isMain }) => (isMain ? "calc(100% - 20px)" : "100%")};
  max-height: 276px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: ${({ isMain }) => (isMain ? "93%" : "calc(100% + 6px)")};
  left: 50%;
  transform: translateX(-50%);
  z-index: ${zindex.searchResult};
  padding: 16px;
  overflow-y: auto;
  gap: 8px;
`;
