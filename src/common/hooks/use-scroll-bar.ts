import { useState } from "react";
import { css } from "styled-components";

export const scrollbarStyle = css`
  &::-webkit-scrollbar {
    display: block;
  }

  &::-webkit-scrollbar-thumb {
    display: none;
  }

  &.scroll-visible {
    overflow: hidden auto;
    overflow-y: overlay;
  }

  &.scroll-visible::-webkit-scrollbar {
    position: absolute;
    width: 8px;
    background-color: transparent;
  }

  &.scroll-visible::-webkit-scrollbar-thumb {
    width: 4px;
    position: absolute;
    display: block;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.dimmed50};
  }
`;

export const useScrollbar = () => {
  const [scrollVisible, setScrollVisible] = useState(false);

  const onFocusIn = () => {
    setScrollVisible(true);
  };

  const onFocusOut = () => {
    setScrollVisible(false);
  };

  return {
    scrollVisible,
    onFocusIn,
    onFocusOut,
  };
};
