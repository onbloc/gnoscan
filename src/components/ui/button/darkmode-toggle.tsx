"use client";

import React, { useCallback } from "react";
import styled from "styled-components";
import Moon from "@/assets/svgs/icon-moon.svg";
import Sun from "@/assets/svgs/icon-sun.svg";
import mixins from "@/styles/mixins";
import { useRecoilState } from "recoil";
import { themeState } from "@/states";
import theme from "@/styles/theme";
import { setItem } from "@/repositories/storage/storage";

interface ToggleButtonProps {
  darkMode?: boolean;
  className?: string;
}

export const DarkModeToggle = ({ className }: ToggleButtonProps) => {
  const [themeMode, setThemeMode] = useRecoilState(themeState);
  const toggleTheme = () => {
    const updatedTheme = themeMode === "dark" ? "light" : "dark";
    setItem("theme", updatedTheme);
    setThemeMode(updatedTheme);
  };

  return (
    <Wrapper onClick={toggleTheme} className={className}>
      <ToggleButton darkMode={themeMode === "dark"}>{themeMode === "dark" ? <Moon /> : <Sun />}</ToggleButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  position: relative;
  width: 60px;
  height: 32px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
`;

const ToggleButton = styled.div<ToggleButtonProps>`
  ${mixins.flexbox("row", "center", "center")};
  width: 22px;
  height: 22px;
  transition: all 0.2s ease;
  position: absolute;
  left: ${({ darkMode }) => (darkMode ? "33px" : "5px")};
`;
